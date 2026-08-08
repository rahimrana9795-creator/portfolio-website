from django.contrib import admin

from .models import ContactMessage, Experience, Page, PageView, Project, Service, Skill, SiteContent


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'tech', 'status', 'is_featured', 'order')
    list_editable = ('status', 'is_featured', 'order')
    list_filter = ('status', 'is_featured')
    search_fields = ('title', 'tech', 'description')
    ordering = ('order', 'title')
    save_on_top = True


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title', 'icon', 'order')
    list_editable = ('order',)
    search_fields = ('title',)


@admin.register(Skill)
class SkillAdmin(admin.ModelAdmin):
    list_display = ('name', 'level', 'order')
    list_editable = ('level', 'order')
    search_fields = ('name',)


@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('role', 'company', 'years', 'order')
    list_editable = ('order',)
    search_fields = ('role', 'company')


@admin.register(Page)
class PageAdmin(admin.ModelAdmin):
    list_display = ('title', 'route_path', 'show_in_nav', 'is_published', 'order')
    list_editable = ('show_in_nav', 'is_published', 'order')
    list_filter = ('show_in_nav', 'is_published')
    search_fields = ('title', 'route_path', 'intro', 'body')
    prepopulated_fields = {'route_path': ('title',)}
    ordering = ('order', 'title')


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'subject', 'is_read', 'created')
    list_filter = ('is_read', 'created')
    list_editable = ('is_read',)
    search_fields = ('name', 'email', 'subject', 'message')
    readonly_fields = ('name', 'email', 'subject', 'message', 'created')
    ordering = ('-created',)


@admin.register(PageView)
class PageViewAdmin(admin.ModelAdmin):
    list_display = ('path', 'ip_address', 'viewed_at')
    list_filter = ('viewed_at',)
    search_fields = ('path', 'ip_address', 'user_agent')
    readonly_fields = ('path', 'ip_address', 'user_agent', 'viewed_at')
    ordering = ('-viewed_at',)
    date_hierarchy = 'viewed_at'


@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    list_display = ('site_name', 'resume_file')
    fieldsets = (
        ('Branding', {
            'fields': ('site_name', 'footer_text')
        }),
        ('Home Page', {
            'fields': ('hero_title', 'hero_text', 'about_title', 'about_text', 'services_title', 'projects_title', 'contact_title')
        }),
        ('Profile Page', {
            'fields': ('profile_page_title', 'profile_intro_title', 'profile_intro_text', 'profile_work_title', 'profile_work_text', 'profile_skills_title')
        }),
        ('Resume Page', {
            'fields': ('resume_page_title', 'resume_summary_title', 'resume_summary_text', 'resume_contact_title', 'resume_contact_text', 'resume_education_title', 'resume_education_text', 'resume_file')
        }),
    )
