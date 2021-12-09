from rest_framework import serializers
from .models import *

class UnprocessedAudioSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnprocessedAudio
        fields = ('id', 'title', 'filename', 'filedata')