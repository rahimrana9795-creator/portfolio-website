import logging
from datetime import timedelta

from django.conf import settings
from django.core.mail import EmailMessage
from django.db.models import Count
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import user_passes_test
from django.utils import timezone

from .forms import ContactMessageForm
from .models import ContactMessage, Page, PageView, Project, Service, Skill, Experience, SiteContent

logger = logging.getLogger(__name__)


def get_site_content():
    try:
        return SiteContent.objects.first() or SiteContent()
    except Exception:
        return SiteContent()


def get_nav_pages():
    try:
        return Page.objects.filter(is_published=True, show_in_nav=True).order_by('order', 'title')
    except Exception:
        return Page.objects.none()


def home(request):
    site_content = get_site_content()
    try:
        featured_projects = Project.objects.order_by('order', 'title')[:6]
    except Exception:
        featured_projects = []
    try:
        services = Service.objects.order_by('order')
    except Exception:
        services = []
    contact_form = ContactMessageForm()
    return render(request, 'index.html', {
        'projects': featured_projects,
        'services': services,
        'contact_form': contact_form,
        'site_content': site_content,
        'nav_pages': get_nav_pages(),
    })


def contact(request):
    if request.method != 'POST':
        return redirect('home')

    form = ContactMessageForm(request.POST)
    if form.is_valid():
        message = form.save()
        subject = f"New message from {message.name}"
        body = (
            f"Name: {message.name}\n"
            f"Email: {message.email}\n"
            f"Subject: {message.subject}\n\n"
            f"{message.message}"
        )
        recipient = getattr(settings, 'CONTACT_EMAIL', '') or settings.DEFAULT_FROM_EMAIL
        logger.info(
            "Contact form submission saved: id=%s backend=%s recipient=%s from=%s reply_to=%s",
            message.pk,
            settings.EMAIL_BACKEND,
            recipient,
            settings.DEFAULT_FROM_EMAIL,
            message.email,
        )
        try:
            email_message = EmailMessage(
                subject,
                body,
                settings.DEFAULT_FROM_EMAIL,
                [recipient],
                reply_to=[message.email],
            )
            delivered = email_message.send(fail_silently=False)
            if delivered:
                logger.info(
                    "Contact email delivered successfully: message_id=%s recipients=%s",
                    message.pk,
                    [recipient],
                )
                messages.success(request, 'We will contact you soon.')
            else:
                logger.warning(
                    "Contact email send returned 0: message_id=%s recipients=%s",
                    message.pk,
                    [recipient],
                )
                messages.error(
                    request,
                    'Message saved, but email could not be delivered. Please check SMTP settings.'
                )
        except Exception:
            logger.exception('Contact email delivery failed for message %s', message.pk)
            messages.error(
                request,
                'Message saved, but email delivery failed. Please try again later.'
            )
        return redirect('home')

    try:
        projects = Project.objects.order_by('order', 'title')[:6]
    except Exception:
        projects = []
    try:
        services = Service.objects.order_by('order')
    except Exception:
        services = []
    return render(request, 'index.html', {
        'projects': projects,
        'services': services,
        'contact_form': form,
        'site_content': get_site_content(),
        'nav_pages': get_nav_pages(),
    })


def admin_required(user):
    return user.is_active and user.is_superuser


@user_passes_test(admin_required, login_url='/admin/login/')
def dashboard(request):
    total_views = PageView.objects.count()
    unique_visitors = PageView.objects.values('ip_address').distinct().count()
    total_messages = ContactMessage.objects.count()
    unread_messages = ContactMessage.objects.filter(is_read=False).count()
    total_projects = Project.objects.count()
    featured_projects = Project.objects.filter(is_featured=True).count()

    today = timezone.now().date()
    views_today = PageView.objects.filter(viewed_at__date=today).count()
    week_ago = timezone.now() - timedelta(days=7)
    views_week = PageView.objects.filter(viewed_at__gte=week_ago).count()

    recent_messages = ContactMessage.objects.order_by('-created')[:5]
    popular_pages = (
        PageView.objects.values('path')
        .annotate(count=Count('id'))
        .order_by('-count')[:5]
    )

    # Weekly views for the chart (last 7 days)
    days = []
    counts = []
    for offset in range(6, -1, -1):
        day = today - timedelta(days=offset)
        days.append(day.strftime('%a'))
        counts.append(PageView.objects.filter(viewed_at__date=day).count())

    return render(request, 'dashboard.html', {
        'total_views': total_views,
        'unique_visitors': unique_visitors,
        'total_messages': total_messages,
        'unread_messages': unread_messages,
        'total_projects': total_projects,
        'featured_projects': featured_projects,
        'views_today': views_today,
        'views_week': views_week,
        'recent_messages': recent_messages,
        'popular_pages': popular_pages,
        'chart_labels': days,
        'chart_data': counts,
    })


@user_passes_test(admin_required, login_url='/admin/login/')
def profile(request):
    try:
        skills = Skill.objects.order_by('order')
    except Exception:
        skills = []
    return render(request, 'profile.html', {
        'site_content': get_site_content(),
        'skills': skills,
    })


def projects(request):
    try:
        projects = Project.objects.order_by('order', 'title')
    except Exception:
        projects = []
    return render(request, 'projects.html', {
        'projects': projects,
        'site_content': get_site_content(),
        'nav_pages': get_nav_pages(),
    })


@user_passes_test(admin_required, login_url='/admin/login/')
def analytics(request):
    today = timezone.now().date()

    views_today = PageView.objects.filter(viewed_at__date=today).count()
    views_week = PageView.objects.filter(
        viewed_at__gte=timezone.now() - timedelta(days=7)
    ).count()
    views_total = PageView.objects.count()
    unique_visitors = PageView.objects.values('ip_address').distinct().count()

    # Last 14 days for the trend chart
    days = []
    counts = []
    for offset in range(13, -1, -1):
        day = today - timedelta(days=offset)
        days.append(day.strftime('%d %b'))
        counts.append(PageView.objects.filter(viewed_at__date=day).count())

    # Top pages
    top_pages = (
        PageView.objects.values('path')
        .annotate(views=Count('id'))
        .order_by('-views')[:8]
    )

    # Views per hour of day (traffic pattern) — bucketed in Python for cross-database safety
    recent_views = (
        PageView.objects
        .filter(viewed_at__gte=timezone.now() - timedelta(days=7))
        .values_list('viewed_at', flat=True)
    )
    hourly_buckets = {}
    for viewed_at in recent_views.iterator():
        hour_key = viewed_at.astimezone(timezone.get_current_timezone()).strftime('%H:00')
        hourly_buckets[hour_key] = hourly_buckets.get(hour_key, 0) + 1
    hours = [f"{h:02d}:00" for h in range(24)]
    hourly_counts = [hourly_buckets.get(h, 0) for h in hours]

    return render(request, 'analytics.html', {
        'views_today': views_today,
        'views_week': views_week,
        'views_total': views_total,
        'unique_visitors': unique_visitors,
        'chart_labels': days,
        'chart_data': counts,
        'top_pages': top_pages,
        'hourly_labels': hours,
        'hourly_data': hourly_counts,
    })


def resume(request):
    try:
        experiences = Experience.objects.order_by('order')
    except Exception:
        experiences = []
    try:
        skills = Skill.objects.order_by('order')
    except Exception:
        skills = []
    return render(request, 'resume.html', {
        'experiences': experiences,
        'skills': skills,
        'site_content': get_site_content(),
        'nav_pages': get_nav_pages(),
    })


@user_passes_test(admin_required, login_url='/admin/login/')
def messages_page(request):
    try:
        messages_list = ContactMessage.objects.order_by('-created')
    except Exception:
        messages_list = []
    unread_count = ContactMessage.objects.filter(is_read=False).count()
    read_count = ContactMessage.objects.filter(is_read=True).count()
    return render(request, 'messages.html', {
        'messages_list': messages_list,
        'unread_count': unread_count,
        'read_count': read_count,
    })


@user_passes_test(admin_required, login_url='/admin/login/')
def message_mark_read(request, message_id):
    message = get_object_or_404(ContactMessage, pk=message_id)
    message.is_read = True
    message.save(update_fields=['is_read'])
    return redirect('messages')


@user_passes_test(admin_required, login_url='/admin/login/')
def message_mark_unread(request, message_id):
    message = get_object_or_404(ContactMessage, pk=message_id)
    message.is_read = False
    message.save(update_fields=['is_read'])
    return redirect('messages')


@user_passes_test(admin_required, login_url='/admin/login/')
def message_delete(request, message_id):
    message = get_object_or_404(ContactMessage, pk=message_id)
    message.delete()
    messages.success(request, 'Message deleted.')
    return redirect('messages')


@user_passes_test(admin_required, login_url='/admin/login/')
def messages_mark_all_read(request):
    ContactMessage.objects.filter(is_read=False).update(is_read=True)
    messages.success(request, 'All messages marked as read.')
    return redirect('messages')


@user_passes_test(admin_required, login_url='/admin/login/')
def settings_page(request):
    stats = {
        'projects': Project.objects.count(),
        'messages': ContactMessage.objects.count(),
        'pages': Page.objects.count(),
        'views': PageView.objects.count(),
    }
    return render(request, 'settings.html', {
        'stats': stats,
        'site_content': get_site_content(),
    })


def page_detail(request, url_path):
    try:
        page = Page.objects.filter(route_path=url_path.strip('/').lower(), is_published=True).first()
    except Exception:
        page = None
    if page is None:
        from django.http import Http404
        raise Http404('Page not found')

    return render(request, 'page_detail.html', {
        'page': page,
        'site_content': get_site_content(),
        'nav_pages': get_nav_pages(),
    })
