from django.db import models

# Create your models here.

class UnprocessedAudio(models.Model):
    title = models.CharField(max_length=120)
    filename = models.CharField(max_length=120)
    filedata = models.FileField(blank=True)

    def __str__(self):
        return self.title