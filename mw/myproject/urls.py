from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('dashboard/', views.dashboard, name='dashboard'),
    path('projects/', views.projects, name='projects'),
    path('resume/', views.resume, name='resume'),
    path('contact/', views.contact, name='contact'),
    path('profile/', views.profile, name='profile'),
    path('analytics/', views.analytics, name='analytics'),
    path('messages/', views.messages_page, name='messages'),
    path('messages/mark-all-read/', views.messages_mark_all_read, name='messages_mark_all_read'),
    path('messages/<int:message_id>/read/', views.message_mark_read, name='message_mark_read'),
    path('messages/<int:message_id>/unread/', views.message_mark_unread, name='message_mark_unread'),
    path('messages/<int:message_id>/delete/', views.message_delete, name='message_delete'),
    path('settings/', views.settings_page, name='settings'),
    path('<path:url_path>/', views.page_detail, name='page_detail'),
]
