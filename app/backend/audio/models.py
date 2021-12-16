from django.db import models

# Create your models here.

class AudioFile(models.Model):
    title = models.CharField(max_length=120)
    filedata = models.FileField(blank=True)

    def __str__(self):
        return self.title


class AudioSample(models.Model):
    title = 'sample'
    audiofile = models.ForeignKey(AudioFile, on_delete=models.CASCADE)
    value = models.SmallIntegerField(0)

    def __str__(self):
        return self.title