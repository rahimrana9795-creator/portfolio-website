from django import forms
from .models import ContactMessage


class ContactMessageForm(forms.ModelForm):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'subject', 'message']
        widgets = {
            'name': forms.TextInput(attrs={'placeholder': 'Your Name', 'required': 'required'}),
            'email': forms.EmailInput(attrs={'placeholder': 'Your Email', 'required': 'required'}),
            'subject': forms.TextInput(attrs={'placeholder': 'Subject', 'required': 'required'}),
            'message': forms.Textarea(attrs={'placeholder': 'Your Message', 'required': 'required', 'rows': 6}),
        }
    