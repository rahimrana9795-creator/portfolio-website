from django.core.exceptions import ValidationError
from django.db import models


class Project(models.Model):
    STATUS_CHOICES = [
        ('Complete', 'Complete'),
        ('In Progress', 'In Progress'),
        ('Planned', 'Planned'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    tech = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=100, choices=STATUS_CHOICES, default='Complete')
    url = models.URLField(blank=True, help_text='Live preview URL')
    source_url = models.URLField(blank=True, help_text='GitHub or source code URL')
    thumbnail_url = models.URLField(blank=True, help_text='Optional project screenshot or cover image URL')
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


class Service(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    icon = models.CharField(max_length=100, blank=True, help_text='Font Awesome class name, e.g. fas fa-code')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def __str__(self):
        return self.title


class Skill(models.Model):
    name = models.CharField(max_length=100)
    level = models.CharField(max_length=100, blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'name']

    def __str__(self):
        return self.name


class Experience(models.Model):
    role = models.CharField(max_length=200)
    company = models.CharField(max_length=200)
    years = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'company']

    def __str__(self):
        return f"{self.role} at {self.company}"


class Page(models.Model):
    RESERVED_PATHS = {
        'admin', 'contact', 'dashboard', 'messages', 'projects', 'profile',
        'resume', 'settings', 'analytics', 'login', 'logout', 'signup',
        'password-reset', 'reset', 'static', 'media'
    }

    title = models.CharField(max_length=200)
    route_path = models.CharField(
        max_length=255,
        unique=True,
        help_text='URL path without a leading slash, e.g. services or services/web-design'
    )
    intro = models.CharField(max_length=255, blank=True)
    body = models.TextField()
    hero_image_url = models.URLField(blank=True)
    cta_label = models.CharField(max_length=100, blank=True)
    cta_url = models.CharField(max_length=255, blank=True, help_text='Internal path or full URL')
    show_in_nav = models.BooleanField(default=True)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order', 'title']

    def clean(self):
        super().clean()
        normalized_path = self.route_path.strip('/').lower()
        if normalized_path in self.RESERVED_PATHS:
            raise ValidationError({'route_path': 'This path is reserved by the site.'})
        self.route_path = normalized_path

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return f"{self.name} <{self.email}>: {self.subject}"


class SiteContent(models.Model):
    site_name = models.CharField(max_length=200, default='Rahim Portfolio')
    hero_title = models.CharField(max_length=200, default="Hi, I'm Rahim.")
    hero_text = models.TextField(default='I design and build modern web applications, portfolio sites, and digital experiences that help brands stand out online.')
    about_title = models.CharField(max_length=200, default='About Me')
    about_text = models.TextField(default="I'm a full-stack web developer with a passion for crafting beautiful interfaces and building robust backend systems. I love turning ideas into polished digital products that users enjoy.")
    services_title = models.CharField(max_length=200, default='What I Do')
    projects_title = models.CharField(max_length=200, default='Featured Projects')
    contact_title = models.CharField(max_length=200, default='Contact Me')
    profile_page_title = models.CharField(max_length=200, default='About Me')
    profile_intro_title = models.CharField(max_length=200, default='Who I Am')
    profile_intro_text = models.TextField(default='I am a passionate web developer skilled in Python, Django, HTML, CSS, and JavaScript. I enjoy creating clean user interfaces and efficient backend services.')
    profile_work_title = models.CharField(max_length=200, default='What I Do')
    profile_work_text = models.TextField(default='I build portfolio websites, admin dashboards, and web apps with authentication, responsive design, and modern UX.')
    profile_skills_title = models.CharField(max_length=200, default='Skills')
    resume_page_title = models.CharField(max_length=200, default='Resume')
    resume_summary_title = models.CharField(max_length=200, default='Summary')
    resume_summary_text = models.TextField(default='Experienced web developer specializing in Django, responsive design, and backend systems. Skilled at building polished, production-ready portfolio websites and dashboards.')
    resume_contact_title = models.CharField(max_length=200, default='Contact')
    resume_contact_text = models.TextField(default='Email: youremail@example.com\nPhone: +92 300 0000000\nLocation: Pakistan')
    resume_education_title = models.CharField(max_length=200, default='Education')
    resume_education_text = models.TextField(default="Bachelor's in Computer Science, UET, 2021 - 2025")
    resume_file = models.FileField(upload_to='resumes/', blank=True, null=True)
    footer_text = models.CharField(max_length=255, default='© 2026 Rahim Portfolio. All Rights Reserved.')

    class Meta:
        verbose_name = 'Site Content'
        verbose_name_plural = 'Site Content'

    def __str__(self):
        return self.site_name


class PageView(models.Model):
    path = models.CharField(max_length=500)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-viewed_at']
        verbose_name = 'Page View'
        verbose_name_plural = 'Page Views'

    def __str__(self):
        return f"{self.path} @ {self.viewed_at}"
