"""
product_service.py — Fetches real Amazon (IN) products via RapidAPI.

Falls back to the local catalog (items.json enriched) when:
  • RAPIDAPI_KEY is not set
  • The API call fails / times out
  • 0 results are returned

Price tracking is applied to every product regardless of source.
"""

import json
import os
import re
from typing import List, Optional

import requests

from app.models.schemas import ExtractedIntent, Product
from app.services.price_tracker import get_price_drop, record_price, seed_local_drop

# ── Config ────────────────────────────────────────────────────────────────────

RAPIDAPI_KEY  = os.environ.get("RAPIDAPI_KEY", "")
RAPIDAPI_HOST = "real-time-amazon-data.p.rapidapi.com"
BASE_URL      = f"https://{RAPIDAPI_HOST}"

_LOCAL_DATA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "items.json",
)

# ── Helpers ────────────────────────────────────────────────────────────────────

def _parse_price(price_str: Optional[str]) -> Optional[float]:
    """Parse '₹1,34,999' → 134999.0"""
    if not price_str:
        return None
    cleaned = re.sub(r"[^\d.]", "", price_str)
    try:
        return float(cleaned)
    except ValueError:
        return None


def _brand_from_title(title: str) -> str:
    KNOWN_BRANDS = [
        "Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Redmi", "POCO",
        "Realme", "Sony", "ASUS", "HP", "Dell", "Lenovo", "Acer", "LG",
        "Motorola", "Oppo", "Vivo", "Nothing", "iQOO",
    ]
    title_low = title.lower()
    for brand in KNOWN_BRANDS:
        if brand.lower() in title_low:
            return brand
    return title.split()[0] if title else "Unknown"


def _map_category(title: str, intent_category: Optional[str]) -> str:
    if intent_category:
        return intent_category.lower()
    t = title.lower()
    if any(w in t for w in ["phone", "mobile", "smartphone"]):
        return "phone"
    if any(w in t for w in ["laptop", "notebook", "chromebook"]):
        return "laptop"
    if any(w in t for w in ["headphone", "earphone", "earbuds", "airpods", "buds"]):
        return "headphones"
    if "watch" in t:
        return "smartwatch"
    if "tablet" in t or "ipad" in t:
        return "tablet"
    return intent_category or "electronics"


def _build_query(intent: Optional[ExtractedIntent]) -> str:
    parts = []
    if intent:
        if intent.brand:
            parts.append(intent.brand)
        if intent.category:
            parts.append(intent.category)
        if intent.keyword:
            parts.append(intent.keyword)
    return " ".join(parts) if parts else "electronics India"


def _sort_param(intent: Optional[ExtractedIntent]) -> str:
    if not intent or not intent.sort_by:
        return "RELEVANCE"
    mapping = {
        "price":   "PRICE_ASC",
        "rating":  "AVERAGE_REVIEW",
        "value":   "RELEVANCE",
        "camera":  "RELEVANCE",
        "battery": "RELEVANCE",
    }
    return mapping.get(intent.sort_by, "RELEVANCE")


# ── Amazon Fetch ──────────────────────────────────────────────────────────────

def _fetch_from_amazon(
    query: str,
    sort_by: str = "RELEVANCE",
    max_results: int = 8,
    intent: Optional[ExtractedIntent] = None,
) -> List[Product]:
    if not RAPIDAPI_KEY:
        return []

    headers = {
        "x-rapidapi-key":  RAPIDAPI_KEY,
        "x-rapidapi-host": RAPIDAPI_HOST,
    }
    params = {
        "query":   query,
        "page":    "1",
        "country": "IN",
        "sort_by": sort_by,
    }

    try:
        resp = requests.get(
            f"{BASE_URL}/search",
            headers=headers,
            params=params,
            timeout=12,
        )
        resp.raise_for_status()
        raw = resp.json().get("data", {}).get("products", [])
    except Exception as e:
        print(f"[Amazon API] fetch error: {e}")
        return []

    products: List[Product] = []
    for i, p in enumerate(raw):
        if len(products) >= max_results:
            break

        price = _parse_price(p.get("product_price"))
        if price is None or price <= 0:
            continue

        # Client-side budget guard
        if intent:
            if intent.budget and price > intent.budget:
                continue
            if intent.min_budget and price < intent.min_budget:
                continue

        original_price = _parse_price(p.get("product_original_price"))
        if original_price and original_price <= price:
            original_price = None

        try:
            rating = float(p.get("product_star_rating") or 0)
        except (ValueError, TypeError):
            rating = 0.0

        asin       = p.get("asin") or f"u{i}"
        product_id = f"amz_{asin}"
        title      = (p.get("product_title") or "Unknown Product")[:100]

        # Price tracking
        record_price(product_id, price)
        drop_info = get_price_drop(product_id)

        # If no historic drop yet but originalPrice indicates one, seed it
        if not drop_info and original_price:
            seed_local_drop(product_id, price, original_price)
            drop_info = get_price_drop(product_id)

        products.append(Product(
            id           = product_id,
            name         = title,
            brand        = _brand_from_title(title),
            category     = _map_category(title, intent.category if intent else None),
            price        = price,
            originalPrice= original_price,
            rating       = rating,
            reviewCount  = int(p.get("product_num_ratings") or 0),
            image        = p.get("product_photo") or "",
            features     = [],
            description  = title,
            buy_url      = p.get("product_url") or "",
            price_drop      = drop_info[0] if drop_info else None,
            price_drop_days = drop_info[1] if drop_info else None,
            source       = "amazon",
        ))

    return products


# ── Local Catalog Fallback ────────────────────────────────────────────────────

def _load_local() -> List[Product]:
    with open(_LOCAL_DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)
    products = []
    for p in data:
        obj = Product(**p)
        # Seed price tracker for local items with originalPrice
        if obj.originalPrice and obj.originalPrice > obj.price:
            seed_local_drop(obj.id, obj.price, obj.originalPrice)
        drop_info = get_price_drop(obj.id)
        obj.price_drop      = drop_info[0] if drop_info else None
        obj.price_drop_days = drop_info[1] if drop_info else None
        obj.source          = "local"
        products.append(obj)
    return products


def _filter_local(
    products: List[Product],
    intent: Optional[ExtractedIntent],
) -> List[Product]:
    if not intent:
        return products

    filtered = list(products)

    if intent.category:
        filtered = [p for p in filtered if intent.category.lower() in p.category.lower()]
    if intent.budget:
        filtered = [p for p in filtered if p.price <= intent.budget]
    if intent.min_budget:
        filtered = [p for p in filtered if p.price >= intent.min_budget]
    if intent.brand:
        filtered = [p for p in filtered if intent.brand.lower() in p.brand.lower()]
    if intent.keyword:
        kw = intent.keyword.lower()
        filtered = [
            p for p in filtered
            if kw in p.description.lower()
            or any(kw in f.lower() for f in p.features)
            or kw in p.name.lower()
        ]

    sort_by = intent.sort_by
    if sort_by == "price":
        filtered.sort(key=lambda p: p.price)
    elif sort_by == "rating":
        filtered.sort(key=lambda p: p.rating, reverse=True)
    elif sort_by == "value":
        filtered.sort(key=lambda p: p.rating / max(p.price, 1), reverse=True)
    else:
        filtered.sort(key=lambda p: p.rating, reverse=True)

    return filtered


# ── Public API ────────────────────────────────────────────────────────────────

def fetch_products(intent: Optional[ExtractedIntent], max_results: int = 8) -> List[Product]:
    """
    Main entry point. Returns Amazon products when possible, local otherwise.
    """
    if RAPIDAPI_KEY:
        query   = _build_query(intent)
        sort_by = _sort_param(intent)
        results = _fetch_from_amazon(query, sort_by, max_results, intent)
        if results:
            return results
        print("[ProductService] Amazon returned 0 results — falling back to local catalog")

    local = _load_local()
    return _filter_local(local, intent)


def search_single(name: str) -> Optional[Product]:
    """
    Targeted search for a single product by name (used in comparison mode).
    Returns the best match or None.
    """
    results = _fetch_from_amazon(name, "RELEVANCE", 1, None)
    if results:
        return results[0]

    # Fall back: find best match in local catalog
    local = _load_local()
    name_low = name.lower()
    for p in local:
        if name_low in p.name.lower() or p.name.lower() in name_low:
            return p
    tokens = set(name_low.split())
    best, best_score = None, 0
    for p in local:
        score = len(tokens & set(p.name.lower().split()))
        if score > best_score:
            best, best_score = p, score
    return best if best_score > 0 else None
