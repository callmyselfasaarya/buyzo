from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class Product(BaseModel):
    id: str
    name: str
    category: str
    price: float
    originalPrice: Optional[float] = None
    rating: float
    reviewCount: int = 0
    brand: str
    image: str
    features: List[str] = []
    description: str
    # ── Real-data extensions ──────────────────────────────────────
    buy_url: Optional[str] = None          # direct Amazon / affiliate link
    price_drop: Optional[int] = None       # ₹ dropped vs last week
    price_drop_days: Optional[int] = None  # days since it was higher
    source: str = "local"                  # "amazon" | "local"

# ── Comparison ────────────────────────────────────────────────────────────────

class AttributeRow(BaseModel):
    attribute: str          # e.g. "Price", "Rating", "Camera"
    values: List[str]       # one value per compared product (same order)
    winner_index: Optional[int] = None  # 0-based index of the winning product

class ComparisonResult(BaseModel):
    products: List[Product]
    attribute_rows: List[AttributeRow]
    verdict: str            # "Overall, X wins because..."

# ── Chat Request / Response ───────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []
    last_product_ids: List[str] = []   # IDs shown in last assistant turn

class ChatResponse(BaseModel):
    reply: str
    products: List[Product] = []
    comparison: Optional[ComparisonResult] = None
    recommendation_reason: Optional[str] = None  # "This is best because…"
    best_product_id: Optional[str] = None         # ID of the top recommended product

# ── Internal AI Result ────────────────────────────────────────────────────────

class ExtractedIntent(BaseModel):
    category: Optional[str] = None
    budget: Optional[float] = None
    min_budget: Optional[float] = None
    brand: Optional[str] = None
    keyword: Optional[str] = None
    sort_by: Optional[str] = None          # "camera", "price", "battery", "value"
    compare_names: Optional[List[str]] = None  # names to compare side-by-side
    is_comparison: bool = False
    is_follow_up: bool = False             # cheaper, better camera etc.

class AIChatResponse(BaseModel):
    response_message: str
    intent: Optional[ExtractedIntent] = None
    recommendation_reason: Optional[str] = None
    best_product_name: Optional[str] = None
