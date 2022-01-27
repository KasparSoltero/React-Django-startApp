from rest_framework import serializers
from .models import *

class UnprocessedAudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioFile
        fields = ('id', 'title', 'filedata', 'denoisedFile', 'duration')