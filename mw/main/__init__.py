"""Raw PostgreSQL access helpers (outside the Django ORM).

Useful for scripts and lightweight operations that do not want to boot the
full Django stack. Django itself uses the ORM connections configured in
``mw/settings.py``; this module is a thin wrapper around ``psycopg2``.
"""

import os
import threading
from functools import lru_cache
from pathlib import Path

import psycopg2
from dotenv import load_dotenv
from psycopg2 import pool
from psycopg2.extras import RealDictCursor

# Load .env from the project root (same pattern as mw/settings.py).
# mw/main/__init__.py -> mw/main -> mw -> project root
_ENV_FILE = Path(__file__).resolve().parent.parent.parent / '.env'
load_dotenv(_ENV_FILE)

_POOL_LOCK = threading.Lock()
_connection_pool = None
_DEFAULT_MAX_CONNECTIONS = 10


def _database_url() -> str:
    database_url = os.getenv('DATABASE_URL', '').strip()
    if not database_url:
        raise RuntimeError(
            'DATABASE_URL is not configured. Set it in your .env file, e.g. '
            'DATABASE_URL=postgresql://user:password@localhost:5432/portfolio_db'
        )
    if not database_url.startswith(('postgres://', 'postgresql://')):
        raise RuntimeError('DATABASE_URL must be a postgres:// or postgresql:// URL.')
    return database_url


def _pool_minmax() -> tuple[int, int]:
    """Compute (minconn, maxconn) from DB_POOL_MIN/DB_POOL_MAX env vars."""
    try:
        minconn = max(1, int(os.getenv('DB_POOL_MIN', '1')))
    except (TypeError, ValueError):
        minconn = 1
    try:
        maxconn = int(os.getenv('DB_POOL_MAX', str(_DEFAULT_MAX_CONNECTIONS)))
    except (TypeError, ValueError):
        maxconn = _DEFAULT_MAX_CONNECTIONS
    if maxconn < minconn:
        maxconn = minconn
    return minconn, maxconn


def get_pool() -> pool.AbstractConnectionPool:
    """Return a process-wide psycopg2 connection pool, creating it on first use."""
    global _connection_pool
    with _POOL_LOCK:
        if _connection_pool is None or _connection_pool.closed:
            minconn, maxconn = _pool_minmax()
            _connection_pool = pool.SimpleConnectionPool(
                minconn=minconn,
                maxconn=maxconn,
                dsn=_database_url(),
            )
        return _connection_pool


def get_db_connection():
    """Check out a connection from the pool.

    Closing the returned connection returns it to the pool, so callers should
    always use it as a context manager or ``try/finally`` and call ``close()``.
    """
    return get_pool().getconn()


def release_db_connection(connection) -> None:
    """Return a checked-out connection to the pool. Safe to call once."""
    if connection is None or get_pool().closed:
        return
    try:
        get_pool().putconn(connection)
    except Exception:
        pass


def close_pool() -> None:
    """Close all pooled connections. Call on app shutdown (e.g. atexit)."""
    global _connection_pool
    with _POOL_LOCK:
        if _connection_pool is not None and not _connection_pool.closed:
            _connection_pool.closeall()
        _connection_pool = None


def run_query(query: str, params: tuple | None = None, *, fetch: str = 'all') -> list[dict] | None:
    """Run a parameterized query and return rows as dicts.

    ``fetch`` may be 'all', 'one', or 'none'.
    """
    if fetch not in {'all', 'one', 'none'}:
        raise ValueError("fetch must be 'all', 'one', or 'none'")

    connection = get_db_connection()
    try:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query, params or ())
            if fetch == 'none':
                connection.commit()
                return None
            if fetch == 'one':
                return cursor.fetchone()
            return cursor.fetchall()
    except psycopg2.Error:
        connection.rollback()
        raise
    finally:
        release_db_connection(connection)


@lru_cache(maxsize=1)
def check_connection() -> bool:
    """Connectivity check with a freshly created connection."""
    try:
        connection = psycopg2.connect(
            _database_url(),
            connect_timeout=int(os.getenv('DB_CONNECT_TIMEOUT', '10')),
        )
    except (psycopg2.Error, OSError, ValueError):
        return False
    else:
        with connection.cursor() as cursor:
            cursor.execute('SELECT 1')
            row = cursor.fetchone()
        connection.close()
        return row is not None
