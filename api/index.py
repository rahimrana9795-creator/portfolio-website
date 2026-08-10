import os
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'mw.settings')

from django.core.wsgi import get_wsgi_application

application = get_wsgi_application()

# Vercel's Python runtime looks for an ``app`` WSGI/ASGI export.
app = application
