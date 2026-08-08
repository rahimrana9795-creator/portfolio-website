from django.utils.deprecation import MiddlewareMixin

from .models import PageView

# Paths that should never be logged
SKIP_PREFIXES = (
    '/admin/',
    '/static/',
    '/media/',
    '/accounts/',
    '/__debug__/',
)
SKIP_EXACT = {'/favicon.ico', '/robots.txt', '/sitemap.xml'}


class PageViewMiddleware(MiddlewareMixin):
    """Record every public page view so the analytics dashboard has real data."""

    def process_response(self, request, response):
        if request.method != 'GET':
            return response
        path = request.path
        if path in SKIP_EXACT or path.startswith(SKIP_PREFIXES):
            return response
        if response.status_code >= 400:
            return response

        try:
            PageView.objects.create(
                path=path,
                ip_address=request.META.get('REMOTE_ADDR') or None,
                user_agent=request.META.get('HTTP_USER_AGENT', '')[:500],
            )
        except Exception:
            # Analytics must never break the page load.
            pass
        return response
