from typing import List, Optional
from app.models.schemas import Product, ComparisonResult, AttributeRow


def _feature_score(product: Product, keyword: str) -> int:
    """Count how many features mention a keyword (case-insensitive)."""
    kw = keyword.lower()
    return sum(1 for f in product.features if kw in f.lower())


def _format_price(price: float) -> str:
    return f"₹{price:,.0f}"


def compare_products(products: List[Product]) -> ComparisonResult:
    """Build a structured side-by-side comparison for up to N products."""

    if not products:
        return ComparisonResult(products=[], attribute_rows=[], verdict="No products to compare.")

    rows: List[AttributeRow] = []

    # ── Price ─────────────────────────────────────────────────────────────────
    prices = [p.price for p in products]
    min_price = min(prices)
    price_winner = prices.index(min_price)
    rows.append(AttributeRow(
        attribute="Price",
        values=[_format_price(p.price) for p in products],
        winner_index=price_winner
    ))

    # ── Rating ────────────────────────────────────────────────────────────────
    ratings = [p.rating for p in products]
    max_rating = max(ratings)
    rating_winner = ratings.index(max_rating)
    rows.append(AttributeRow(
        attribute="Rating",
        values=[f"⭐ {p.rating}/5  ({p.reviewCount:,} reviews)" for p in products],
        winner_index=rating_winner
    ))

    # ── Camera (heuristic) ────────────────────────────────────────────────────
    camera_scores = [_feature_score(p, "camera") + _feature_score(p, "mp") for p in products]
    if any(s > 0 for s in camera_scores):
        camera_winner = camera_scores.index(max(camera_scores))
        camera_vals = []
        for p in products:
            cam = next((f for f in p.features if "camera" in f.lower() or "mp" in f.lower()), None)
            camera_vals.append(cam if cam else "Not highlighted")
        rows.append(AttributeRow(
            attribute="Camera",
            values=camera_vals,
            winner_index=camera_winner if max(camera_scores) > 0 else None
        ))

    # ── Battery ───────────────────────────────────────────────────────────────
    battery_scores = [_feature_score(p, "mah") + _feature_score(p, "battery") + _feature_score(p, "hr") for p in products]
    if any(s > 0 for s in battery_scores):
        battery_winner = battery_scores.index(max(battery_scores))
        battery_vals = []
        for p in products:
            bat = next((f for f in p.features if "mah" in f.lower() or "battery" in f.lower() or "hr" in f.lower()), None)
            battery_vals.append(bat if bat else "Not highlighted")
        rows.append(AttributeRow(
            attribute="Battery",
            values=battery_vals,
            winner_index=battery_winner if max(battery_scores) > 0 else None
        ))

    # ── Key Features (top 2) ──────────────────────────────────────────────────
    rows.append(AttributeRow(
        attribute="Key Features",
        values=[", ".join(p.features[:3]) for p in products],
        winner_index=None
    ))

    # ── Value Score (rating / price ratio, normalised) ────────────────────────
    value_scores = [p.rating / p.price * 10000 for p in products]
    best_value_idx = value_scores.index(max(value_scores))
    rows.append(AttributeRow(
        attribute="Value for Money",
        values=[f"{vs:.2f} pts" for vs in value_scores],
        winner_index=best_value_idx
    ))

    # ── Verdict ───────────────────────────────────────────────────────────────
    # Count wins
    win_counts = [0] * len(products)
    for row in rows:
        if row.winner_index is not None:
            win_counts[row.winner_index] += 1

    best_idx = win_counts.index(max(win_counts))
    best = products[best_idx]

    # Build a reason string based on what it won
    won_attrs = [rows[i].attribute for i, row in enumerate(rows) if row.winner_index == best_idx]
    if won_attrs:
        verdict = (
            f"**{best.name}** wins overall — it leads on "
            f"{', '.join(won_attrs[:-1])} and {won_attrs[-1]}."
            if len(won_attrs) > 1
            else f"**{best.name}** wins on {won_attrs[0]}."
        )
    else:
        verdict = f"**{best.name}** is a solid balanced choice."

    return ComparisonResult(products=products, attribute_rows=rows, verdict=verdict)
