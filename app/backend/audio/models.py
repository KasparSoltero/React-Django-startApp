from django.db import models

# Create your models here.

class AudioFile(models.Model):
    title = models.CharField(max_length=120, default='audiofile_title')
    
    #filedata for the original audio file uploaded
    filedata = models.FileField(blank=True)

    #filedata for the denoised file
    denoised_filedata = models.FileField(blank=True)

    #duration of audio file in seconds, stored here for easy access
    duration = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    def __str__(self):
        return self.title


class Animal(models.Model):
    title = models.CharField(max_length=120, default='animal_name')
    color = models.CharField(max_length=120, null=True)

    def __str__(self):
        return self.title


class AudioClip(models.Model):
    title = models.CharField(max_length=120, default='audioclip_title')

    #filedata holds the .wav file for the AudioClip
    filedata = models.FileField(blank=True)

    #parent_audio references the 'AudioFile' object which the 'AudioClip' is a part of
    parent_audio = models.ForeignKey(AudioFile, on_delete=models.CASCADE, blank=True)
    
    #start_time and end_time in seconds relative to the 'parent_audio' .wav file
    start_time = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    end_time = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    #reference_audio references another 'AudioClip' which has 'use_as_ref=True'
    reference_audio = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)

    #use_as_ref determines whether to use the AudioClip as a reference during convolution
    use_as_ref = models.BooleanField(default=False)

    #animal is assigned to reference clips, and carried to all matching AudioClips
    animal = models.ForeignKey(Animal, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return self.title


# class Referenceclip(models.Model):
#     title = models.CharField(max_length=120, default='referencecliptitle')
#     audiofile = models.FileField(blank=True)
#     color = models.CharField(max_length=120, default='none')

#     def __str__(self):
#         return self.title



# class Noiseclip(models.Model):
#     title = models.CharField(max_length=120, default='noisecliptitle')
#     parentAudio = models.ForeignKey(AudioFile, on_delete=models.CASCADE, blank=True)
#     referenceAudio = models.ForeignKey(Referenceclip, on_delete=models.SET_NULL, null=True)

#     useAsReference = models.BooleanField(default=False)
#     color = models.CharField(max_length=120, null=True)

#     audiofile = models.FileField(blank=True)

#     startTime = models.DecimalField(max_digits=5, decimal_places=2, default=0)
#     endTime = models.DecimalField(max_digits=5, decimal_places=2, default=0)

#     def __str__(self):
#         return self.title