from pydantic import BaseModel
from typing import List, Optional

class Product(BaseModel):
    id: str
    name: str
    category: str
    price: float
    rating: float
    brand: str
    image_url: str
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
