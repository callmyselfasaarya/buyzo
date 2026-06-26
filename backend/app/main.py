import os
import sys

# Add the 'backend' parent directory to path to allow 'app.*' absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load .env early so all services pick up keys
try:
    from dotenv import load_dotenv
    _env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
    load_dotenv(_env_path)
except ImportError:
    pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import Product, ChatRequest, ChatResponse, ComparisonResult
from app.services.ai_service import process_chat_intent
from app.services.comparison_service import compare_products
from app.services import product_service

app = FastAPI(title="Buyzo Shopping Brain API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ───────────────────────────────────────────────────────────────────

def _find_best_in(name: str, products: list[Product]) -> Product | None:
    """Fuzzy-match a product name against a list (from AI recommendation)."""
    name_low = name.lower()
    # Exact
    for p in products:
        if p.name.lower() == name_low:
            return p
    # Substring
    for p in products:
        if name_low in p.name.lower() or p.name.lower() in name_low:
            return p
    # Token overlap
    tokens = set(name_low.split())
    best, best_score = None, 0
    for p in products:
        score = len(tokens & set(p.name.lower().split()))
        if score > best_score:
            best, best_score = p, score
    return best if best_score > 0 else None


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/api/products")
async def get_all_products():
    """Return full catalog (Amazon if key present, else local)."""
    return product_service.fetch_products(intent=None, max_results=12)


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # 1. AI intent extraction
    ai_result = process_chat_intent(
        message=request.message,
        history=request.history,
        last_product_ids=request.last_product_ids,
    )
    intent = ai_result.intent

    # ── 2a. Comparison mode ────────────────────────────────────────────────────
    if intent and intent.is_comparison and intent.compare_names:
        compare_products_list: list[Product] = []
        for name in intent.compare_names:
            p = product_service.search_single(name)
            if p:
                compare_products_list.append(p)

        if len(compare_products_list) >= 2:
            comparison = compare_products(compare_products_list)
            best_id = None
            if ai_result.best_product_name:
                bp = _find_best_in(ai_result.best_product_name, compare_products_list)
                best_id = bp.id if bp else None

            return ChatResponse(
                reply=ai_result.response_message,
                products=compare_products_list,
                comparison=comparison,
                recommendation_reason=ai_result.recommendation_reason or comparison.verdict,
                best_product_id=best_id,
            )

    # ── 2b. Follow-up resolution ──────────────────────────────────────────────
    #  If it's a follow-up and we have last product IDs, re-fetch those specific
    #  products from local cache (they may be Amazon products stored temporarily).
    #  For simplicity, we re-run the full fetch and rely on AI intent for focus.

    # ── 2c. Normal filtering via product_service ──────────────────────────────
    filtered = product_service.fetch_products(intent, max_results=8)

    # ── 3. Suppress empty catch-all (no meaningful intent extracted) ──────────
    no_filter = not intent or (
        not intent.category and not intent.budget and not intent.brand
        and not intent.keyword and not intent.is_follow_up
    )
    if no_filter:
        filtered = []

    # ── 4. Resolve best pick ──────────────────────────────────────────────────
    best_id: str | None = None
    if ai_result.best_product_name and filtered:
        bp = _find_best_in(ai_result.best_product_name, filtered)
        if bp:
            best_id = bp.id
            filtered = [bp] + [p for p in filtered if p.id != bp.id]

    filtered = filtered[:6]

    return ChatResponse(
        reply=ai_result.response_message,
        products=filtered,
        comparison=None,
        recommendation_reason=ai_result.recommendation_reason,
        best_product_id=best_id,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
