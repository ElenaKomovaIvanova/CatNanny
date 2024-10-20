from django.contrib import admin
from .models import Profile  # Import your model


# Register the Profile model
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'city', 'bio')  # Specify fields to display in the list
    search_fields = ('user__username', 'phone_number', 'city')  # Specify fields for searching
