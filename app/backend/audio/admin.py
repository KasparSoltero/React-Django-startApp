from django.contrib import admin
from .models import UnprocessedAudio

class UnprocessedAudioAdmin(admin.ModelAdmin):
    list_display = ('title', 'filename', 'filedata')

# Register your models here.

admin.site.register(UnprocessedAudio, UnprocessedAudioAdmin)