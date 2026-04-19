import json
import os
import sys

# Add the 'backend' parent directory to path to allow 'app.*' absolute imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.schemas import Product, ChatRequest, ChatResponse
from app.services.ai_service import process_chat_intent

app = FastAPI(title="Buyzo API")

# Setup CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For dev purposes
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load mock database
def load_products():
    file_path = os.path.join(os.path.dirname(__file__), "data", "items.json")
    with open(file_path, "r") as f:
        data = json.load(f)
        return [Product(**p) for p in data]

PRODUCTS = load_products()

@app.get("/api/products")
async def get_all_products():
    return PRODUCTS

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    # 1. Process intent using AI
    ai_result = process_chat_intent(request.message, request.history)
    intent = ai_result.intent
    
    # 2. Filter products based on extracted intent
    filtered_products = PRODUCTS
    
    if intent:
        if intent.category:
            filtered_products = [p for p in filtered_products if intent.category.lower() in p.category.lower()]
        
        if intent.budget:
            filtered_products = [p for p in filtered_products if p.price <= intent.budget]
            
        if intent.brand:
            filtered_products = [p for p in filtered_products if intent.brand.lower() in p.brand.lower()]
            
        if intent.keyword:
            kw = intent.keyword.lower()
            filtered_products = [p for p in filtered_products if kw in p.name.lower() or kw in p.description.lower()]
            
    # If it's just a general question and no specific matching
    if not intent or (not intent.category and not intent.budget and not intent.brand) and len(filtered_products) == len(PRODUCTS):
        # Don't return all products for a general greeting
        filtered_products = []
        
    return ChatResponse(
        reply=ai_result.response_message,
        products=filtered_products
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
