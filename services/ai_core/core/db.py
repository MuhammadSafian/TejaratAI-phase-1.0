import asyncpg
from core.config import settings

pool: asyncpg.Pool = None

async def init_db():
    """Initialize asyncpg connection pool."""
    global pool
    # asyncpg needs standard postgres:// URL (not postgresql+asyncpg://)
    db_url = settings.DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    pool = await asyncpg.create_pool(db_url, min_size=5, max_size=20)
    return pool

async def close_db():
    """Close the connection pool."""
    global pool
    if pool:
        await pool.close()

async def get_pool() -> asyncpg.Pool:
    """Get the connection pool (lazy init)."""
    global pool
    if pool is None:
        await init_db()
    return pool

async def fetch_one(query: str, *args):
    """Fetch a single row."""
    p = await get_pool()
    return await p.fetchrow(query, *args)

async def fetch_all(query: str, *args):
    """Fetch all rows."""
    p = await get_pool()
    return await p.fetch(query, *args)

async def fetch_val(query: str, *args):
    """Fetch a single value."""
    p = await get_pool()
    return await p.fetchval(query, *args)

async def execute(query: str, *args):
    """Execute a query (INSERT/UPDATE/DELETE)."""
    p = await get_pool()
    return await p.execute(query, *args)
