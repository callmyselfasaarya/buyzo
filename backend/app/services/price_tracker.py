"""
price_tracker.py — Lightweight SQLite price history tracker.

Records price observations per product and detects drops over a 7-day window.
"""

import os
import sqlite3
from datetime import datetime, timedelta
from typing import Optional, Tuple

DB_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "prices.db",
)


def _get_conn() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS price_history (
            product_id   TEXT NOT NULL,
            price        REAL NOT NULL,
            recorded_at  TEXT NOT NULL
        )
    """)
    conn.execute(
        "CREATE INDEX IF NOT EXISTS idx_pid_time ON price_history(product_id, recorded_at)"
    )
    conn.commit()
    return conn


def record_price(product_id: str, price: float) -> None:
    """Insert a price observation only when the price changes."""
    try:
        conn = _get_conn()
        row = conn.execute(
            "SELECT price FROM price_history WHERE product_id=? ORDER BY recorded_at DESC LIMIT 1",
            (product_id,),
        ).fetchone()
        if row is None or abs(row[0] - price) >= 1:
            conn.execute(
                "INSERT INTO price_history (product_id, price, recorded_at) VALUES (?, ?, ?)",
                (product_id, price, datetime.utcnow().isoformat()),
            )
            conn.commit()
        conn.close()
    except Exception as e:
        print(f"[PriceTracker] record error: {e}")


def get_price_drop(product_id: str) -> Optional[Tuple[int, int]]:
    """
    Returns (drop_amount_rupees, days_ago) if price fell vs last week, else None.
    """
    try:
        conn = _get_conn()

        # Current (most recent) price
        current_row = conn.execute(
            "SELECT price FROM price_history WHERE product_id=? ORDER BY recorded_at DESC LIMIT 1",
            (product_id,),
        ).fetchone()
        if not current_row:
            conn.close()
            return None
        current_price = current_row[0]

        # Oldest price recorded more than 7 days ago (to find peak before the drop)
        week_ago = (datetime.utcnow() - timedelta(days=7)).isoformat()
        old_row = conn.execute(
            """SELECT price, recorded_at FROM price_history
               WHERE product_id=? AND recorded_at <= ?
               ORDER BY recorded_at DESC LIMIT 1""",
            (product_id, week_ago),
        ).fetchone()
        conn.close()

        if not old_row:
            return None

        drop = int(old_row[0] - current_price)
        if drop <= 0:
            return None

        days_ago = max((datetime.utcnow() - datetime.fromisoformat(old_row[1])).days, 1)
        return (drop, days_ago)

    except Exception as e:
        print(f"[PriceTracker] read error: {e}")
        return None


def seed_local_drop(product_id: str, current_price: float, original_price: float) -> None:
    """
    Pre-seed the tracker for local catalog items that have an originalPrice,
    so the price-drop badge works even in fallback mode.
    Uses a synthetic entry 8 days ago at the originalPrice.
    """
    if original_price <= current_price:
        return
    try:
        conn = _get_conn()
        exists = conn.execute(
            "SELECT 1 FROM price_history WHERE product_id=? LIMIT 1", (product_id,)
        ).fetchone()
        if not exists:
            eight_days_ago = (datetime.utcnow() - timedelta(days=8)).isoformat()
            conn.execute(
                "INSERT INTO price_history (product_id, price, recorded_at) VALUES (?, ?, ?)",
                (product_id, original_price, eight_days_ago),
            )
            conn.execute(
                "INSERT INTO price_history (product_id, price, recorded_at) VALUES (?, ?, ?)",
                (product_id, current_price, datetime.utcnow().isoformat()),
            )
            conn.commit()
        conn.close()
    except Exception as e:
        print(f"[PriceTracker] seed error: {e}")
