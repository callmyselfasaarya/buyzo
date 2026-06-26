import json
import os
from typing import List, Optional
import google.genai as genai
from app.models.schemas import ExtractedIntent, AIChatResponse

# Load environment variables from .env file (backend/.env)
try:
    from dotenv import load_dotenv
    _env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), ".env")
    load_dotenv(_env_path)
except ImportError:
    pass  # python-dotenv not installed; rely on env already being set

# Resolve API key and return a configured client (new google-genai SDK style)
_client = None

def _get_client():
    global _client
    if _client is None:
        key = os.environ.get("GEMINI_API_KEY")
        if key:
            _client = genai.Client(api_key=key)
    return _client


# ── Catalog summary injected into every prompt ───────────────────────────────

CATALOG_SUMMARY = """
We fetch LIVE products from Amazon India based on the user's request.
Product categories available: phones, laptops, headphones/earbuds, smartwatches, tablets.
Price range: ₹5,000 – ₹3,00,000+ depending on category.
All prices are in Indian Rupees (₹ / INR).
"""

SYSTEM_PROMPT = """You are Buyzo AI, a premium shopping brain — not a simple search engine.
Your job is to REASON through the user's needs, understand their context from conversation history,
and give decisive, helpful recommendations with clear justification.

{catalog}

Rules:
- ALWAYS consider the full conversation history to resolve follow-ups.
  - "cheaper" = cheaper than what was last shown
  - "better camera" = sort last results or category by camera specs
  - "that phone" / "the Samsung" = refers to a product previously mentioned
- When the user wants a comparison, produce is_comparison: true and list compare_names.
- Always pick a best_product_name and give a recommendation_reason when showing 2+ products.
- recommendation_reason should be 1-2 sentences: "This is best because..."
- Be conversational, warm, decisive. Don't just list — explain your choice.
- If budget changed, use the new budget. If category is clear from history, keep it.
- Products are fetched live from Amazon India — reference realistic prices and brands.
""".format(catalog=CATALOG_SUMMARY)



def _build_history_context(history: List[dict], last_product_ids: List[str]) -> str:
    lines = []
    for msg in history[-10:]:  # keep last 10 turns
        role = msg.get("role", "user")
        content = msg.get("content", "")
        lines.append(f"{role.upper()}: {content}")
    if last_product_ids:
        lines.append(f"[Products shown in last turn — IDs: {', '.join(last_product_ids)}]")
    return "\n".join(lines)


def _mock_extract(message: str, history: List[dict]) -> AIChatResponse:
    """Fallback rule-based extraction when Gemini is unavailable."""
    intent = ExtractedIntent()
    msg_low = message.lower()

    # Category detection
    if any(w in msg_low for w in ["phone", "smartphone", "mobile"]):
        intent.category = "phone"
    elif "laptop" in msg_low:
        intent.category = "laptop"
    elif any(w in msg_low for w in ["headphone", "earphone", "earbuds", "airpod"]):
        intent.category = "headphones"
    elif "watch" in msg_low:
        intent.category = "smartwatch"
    elif "tablet" in msg_low or "ipad" in msg_low:
        intent.category = "tablet"

    # Budget
    import re
    budget_match = re.search(r"(?:under|below|within|upto|up to|less than|max|budget)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)(?:k)?", msg_low)
    if budget_match:
        val = budget_match.group(1).replace(",", "")
        intent.budget = float(val) * 1000 if msg_low[budget_match.end()-1] == "k" or "k" in budget_match.group(0) else float(val)

    # Camera follow-up
    if "camera" in msg_low and not intent.category and history:
        intent.is_follow_up = True
        intent.keyword = "camera"
        intent.sort_by = "camera"

    # Cheaper follow-up
    if any(w in msg_low for w in ["cheaper", "less expensive", "lower price", "budget"]) and not intent.category and history:
        intent.is_follow_up = True
        intent.sort_by = "price"

    # Comparison
    if "compare" in msg_low or " vs " in msg_low:
        intent.is_comparison = True

    reply = f"I can help you find a {intent.category if intent.category else 'product'}"
    if intent.budget:
        reply += f" under ₹{intent.budget:,.0f}"
    reply += ". Let me check what we have."

    return AIChatResponse(response_message=reply, intent=intent)


def process_chat_intent(
    message: str,
    history: List[dict],
    last_product_ids: List[str]
) -> AIChatResponse:
    client = _get_client()
    if not client:
        return _mock_extract(message, history)

    try:
        history_context = _build_history_context(history, last_product_ids)

        prompt = f"""{SYSTEM_PROMPT}

=== CONVERSATION HISTORY ===
{history_context if history_context else "(no prior turns)"}

=== CURRENT USER MESSAGE ===
{message}

Respond ONLY with a valid JSON document (no markdown fences) matching this exact schema:
{{
  "response_message": "Friendly, helpful response to the user",
  "intent": {{
    "category": "phone | laptop | headphones | smartwatch | tablet | null",
    "budget": max_price_as_number_or_null,
    "min_budget": min_price_as_number_or_null,
    "brand": "brand name or null",
    "keyword": "feature keyword or null",
    "sort_by": "camera | price | battery | rating | value | null",
    "compare_names": ["Product A", "Product B"] or null,
    "is_comparison": true or false,
    "is_follow_up": true or false
  }},
  "recommendation_reason": "This is best because... (1-2 sentences) or null",
  "best_product_name": "Exact product name from catalog or null"
}}
"""

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
        )
        text = response.text.strip()

        # Strip markdown fences if present
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]

        data = json.loads(text.strip())

        intent_data = data.get("intent", {}) or {}
        intent = ExtractedIntent(
            category=intent_data.get("category"),
            budget=intent_data.get("budget"),
            min_budget=intent_data.get("min_budget"),
            brand=intent_data.get("brand"),
            keyword=intent_data.get("keyword"),
            sort_by=intent_data.get("sort_by"),
            compare_names=intent_data.get("compare_names"),
            is_comparison=bool(intent_data.get("is_comparison", False)),
            is_follow_up=bool(intent_data.get("is_follow_up", False)),
        )

        return AIChatResponse(
            response_message=data.get("response_message", "Here are some options for you."),
            intent=intent,
            recommendation_reason=data.get("recommendation_reason"),
            best_product_name=data.get("best_product_name"),
        )

    except Exception as e:
        print(f"[AI ERROR] {e}")
        return _mock_extract(message, history)