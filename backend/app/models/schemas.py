from pydantic import BaseModel
from typing import List, Optional

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

class ChatRequest(BaseModel):
    message: str
    history: List[dict] = []

class ChatResponse(BaseModel):
    reply: str
    products: List[Product] = []

class ExtractedIntent(BaseModel):
    category: Optional[str] = None
    budget: Optional[float] = None
    brand: Optional[str] = None
    keyword: Optional[str] = None

class AIChatResponse(BaseModel):
    response_message: str
    intent: Optional[ExtractedIntent] = None
