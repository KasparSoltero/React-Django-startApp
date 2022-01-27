from django.contrib import admin
from .models import *

class AudioFileAdmin(admin.ModelAdmin):
    list_display = ('title', 'filedata', 'denoisedFile', 'duration')

class NoiseclipAdmin(admin.ModelAdmin):
    list_display = ('title', 'parentAudio', 'audiofile', 'startTime', 'endTime')

class ReferenceclipAdmin(admin.ModelAdmin):
    list_display = ('title', 'audiofile')
# Register your models here.

admin.site.register(AudioFile, AudioFileAdmin)
admin.site.register(Noiseclip, NoiseclipAdmin)
admin.site.register(Referenceclip, ReferenceclipAdmin)
