import logging

from django.conf import settings
from django.core.mail import EmailMessage
from django.db import OperationalError
from django.shortcuts import render, redirect
from django.contrib import messages
from django.contrib.auth.decorators import user_passes_test

from .forms import ContactMessageForm
from .models import ContactMessage, Project, Service, Skill, Experience, SiteContent, Page

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
    return redirect('admin:index')


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
    return render(request, 'analytics.html')


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
    return render(request, 'messages.html', {'messages_list': messages_list})


@user_passes_test(admin_required, login_url='/admin/login/')
def settings_page(request):
    return render(request, 'settings.html')


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
