from django.contrib.auth.models import User
from django.test import TestCase
from django.urls import reverse

from .models import ContactMessage, PageView


class DashboardAccessTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            username='admin', email='admin@example.com', password='testpass123'
        )

    def test_dashboard_requires_login(self):
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 302)
        self.assertIn('/admin/login/', response.url)

    def test_dashboard_renders_for_admin(self):
        self.client.force_login(self.admin)
        response = self.client.get(reverse('dashboard'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'dashboard.html')
        self.assertContains(response, 'Dashboard Overview')

    def test_analytics_renders_for_admin(self):
        self.client.force_login(self.admin)
        response = self.client.get(reverse('analytics'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'analytics.html')

    def test_settings_renders_for_admin(self):
        self.client.force_login(self.admin)
        response = self.client.get(reverse('settings'))
        self.assertEqual(response.status_code, 200)
        self.assertTemplateUsed(response, 'settings.html')


class MessageActionTests(TestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser(
            username='admin', email='admin@example.com', password='testpass123'
        )
        self.message = ContactMessage.objects.create(
            name='Test User',
            email='test@example.com',
            subject='Hello',
            message='Testing message',
        )
        self.client.force_login(self.admin)

    def test_messages_page_shows_messages(self):
        response = self.client.get(reverse('messages'))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'Test User')
        self.assertEqual(response.context['unread_count'], 1)

    def test_mark_read(self):
        response = self.client.get(reverse('message_mark_read', args=[self.message.id]))
        self.assertEqual(response.status_code, 302)
        self.message.refresh_from_db()
        self.assertTrue(self.message.is_read)

    def test_mark_unread(self):
        self.message.is_read = True
        self.message.save(update_fields=['is_read'])
        response = self.client.get(reverse('message_mark_unread', args=[self.message.id]))
        self.assertEqual(response.status_code, 302)
        self.message.refresh_from_db()
        self.assertFalse(self.message.is_read)

    def test_delete_message(self):
        response = self.client.get(reverse('message_delete', args=[self.message.id]))
        self.assertEqual(response.status_code, 302)
        self.assertEqual(ContactMessage.objects.count(), 0)

    def test_mark_all_read(self):
        ContactMessage.objects.create(
            name='Other', email='other@example.com', subject='S', message='M'
        )
        self.client.get(reverse('messages_mark_all_read'))
        self.assertEqual(ContactMessage.objects.filter(is_read=False).count(), 0)


class PageViewMiddlewareTests(TestCase):
    def test_public_page_view_is_recorded(self):
        self.assertEqual(PageView.objects.count(), 0)
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(PageView.objects.count(), 1)

    def test_admin_page_view_is_not_recorded(self):
        response = self.client.get('/admin/login/')
        self.assertEqual(PageView.objects.count(), 0)
