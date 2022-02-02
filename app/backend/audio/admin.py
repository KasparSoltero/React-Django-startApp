from django.contrib import admin
from .models import *

class AudioFileAdmin(admin.ModelAdmin):
    list_display = ('title', 'filedata', 'denoised_filedata', 'duration')

class AudioClipAdmin(admin.ModelAdmin):
    list_display = ('title', 'filedata', 'parent_audio', 'start_time', 'end_time', 'reference_audio', 'use_as_ref', 'animal')

class AnimalAdmin(admin.ModelAdmin):
    list_display = ('title', 'color')
# Register your models here.

admin.site.register(AudioFile, AudioFileAdmin)
admin.site.register(AudioClip, AudioClipAdmin)
admin.site.register(Animal, AnimalAdmin)
