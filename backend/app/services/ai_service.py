import json
import os
from typing import List
import google.genai as genai
from app.models.schemas import ExtractedIntent, AIChatResponse

# Configure Gemini
api_key = os.environ.get("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)

# A simplified fallback logic if API is not set
def mock_extract(message: str) -> AIChatResponse:
    intent = ExtractedIntent()
    msg_low = message.lower()
    
    if "phone" in msg_low or "smartphone" in msg_low:
        intent.category = "phone"
    if "laptop" in msg_low:
        intent.category = "laptop"
    if "earbuds" in msg_low or "headphones" in msg_low:
        intent.category = "earbuds"
        
    # primitive budget extraction e.g. "under 20k", "under 20000"
    if "under 20k" in msg_low or "under 20000" in msg_low:
        intent.budget = 20000
    if "under 80k" in msg_low or "under 80000" in msg_low:
        intent.budget = 80000
    if "under 50k" in msg_low or "under 50000" in msg_low:
        intent.budget = 50000
        
    return AIChatResponse(
        response_message=f"I can help you find a {intent.category if intent.category else 'product'}{f' under {intent.budget}' if intent.budget else ''}. Let me check what we have in stock.",
        intent=intent
    )

def process_chat_intent(message: str, history: List[dict]) -> AIChatResponse:
    if not api_key:
        return mock_extract(message)
    
    # We will use Gemini to extract JSON
    # For now, let's just use the mock if Gemini isn't configured, 
    # but we can implement a basic Gemini call here using the Structured Outputs if needed.
    
    try:
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
        You are a shopping assistant. Analyze the user's message and extract their shopping intent.
        User message: "{message}"
        
        Respond ONLY with a valid JSON document matching this schema:
        {{
            "response_message": "Friendly response to the user",
            "intent": {{
                "category": "extracted product category or null",
                "budget": extracted max budget as number or null,
                "brand": "extracted brand or null",
                "keyword": "extracted any other feature keyword (like 'camera', 'gaming') or null"
            }}
        }}
        """
        response = model.generate_content(prompt)
        text = response.text
        
        # Clean up text if it contains markdown code blocks
        if "```json" in text:
            text = text.split("```json")[1].split("```")[0]
        elif "```" in text:
            text = text.split("```")[1].split("```")[0]
            
        data = json.loads(text.strip())
        
        intent_data = data.get("intent", {})
        intent = ExtractedIntent(
            category=intent_data.get("category"),
            budget=intent_data.get("budget"),
            brand=intent_data.get("brand"),
            keyword=intent_data.get("keyword")
        )
        
        return AIChatResponse(
            response_message=data.get("response_message", "Here are some options."),
            intent=intent
        )
    except Exception as e:
        print(f"Gemini API error: {e}")
        return mock_extract(message)