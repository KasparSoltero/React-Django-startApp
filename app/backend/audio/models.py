from django.db import models

# Create your models here.

class AudioFile(models.Model):
    title = models.CharField(max_length=120)
    filedata = models.FileField(blank=True)
    duration = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    denoisedFile = models.FileField(blank=True)

    def __str__(self):
        return self.title

class Referenceclip(models.Model):
    title = models.CharField(max_length=120, default='referencecliptitle')
    audiofile = models.FileField(blank=True)
    color = models.CharField(max_length=120, default='none')

    def __str__(self):
        return self.title

class Noiseclip(models.Model):
    title = models.CharField(max_length=120, default='noisecliptitle')
    parentAudio = models.ForeignKey(AudioFile, on_delete=models.CASCADE, blank=True)
    referenceAudio = models.ForeignKey(Referenceclip, on_delete=models.SET_NULL, null=True)

    useAsReference = models.BooleanField(default=False)
    color = models.CharField(max_length=120, null=True)

    audiofile = models.FileField(blank=True)

    startTime = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    endTime = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return self.title