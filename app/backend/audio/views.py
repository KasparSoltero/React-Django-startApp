from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UnprocessedAudioSerializer
from .models import *
from django.views import View
from django.http import HttpResponse
import json

import scipy.io.wavfile as wave
import wave as wave2

from numpy.fft import fft 
import numpy as np
import librosa
from scipy.signal import spectrogram, istft, fftconvolve
import soundfile as sf

from django.core.files import File
from django.core.files.base import ContentFile

# Create your views here.

class UnprocessedAudioView(viewsets.ModelViewSet):
    serializer_class = UnprocessedAudioSerializer
    queryset = AudioFile.objects.all()

    def create(self, request):
        print('\nDebugs:')
        print(request.POST)
        print('\n')

        return HttpResponse('tomato')

    def __str__(self):
        return self.title

def AreaOfCircle(radius): #calculate area of circle
    return 3.14*radius**2

def TestFunctionView(request): #test function for calculating area of a circle

    if request.method == 'POST':

        body = json.loads(request.body) #decode the recieved data into a dictionary of values
        value = body['value'] #index the data from the dictionary labelled 'value'

        print(f'value {value}') #debug
        print(f'type: {type(value)}')

        area = AreaOfCircle(value)

        return HttpResponse(area) #convert area response to Http

def UploadFileView(request):

    if request.method == 'POST':

        data = request.POST
        print(data)
        file = request.FILES['file']

        AudioFile.objects.create(
            title = data['title'],
            filedata = file
        )

        return HttpResponse('success')

def retrieveAudioView(request):

    if request.method == 'GET':

        outputArray = []

        filelist = AudioFile.objects.all()

        for file in filelist:

            f = file.filedata.open(mode='rb')
            filename = f.name
            sr, signal = wave.read(f)

            outputArray.append([filename, list(signal)])
        
        return HttpResponse(outputArray)

def getDenoised(request):

    if request.method == 'POST':

        data = request.POST

        n_fft = 2048
        win_length = 2048
        hop_length = 512


        def STFT(y, n_fft, hop_length, win_length):
            return librosa.stft(y=y, n_fft=n_fft, hop_length=hop_length, win_length=win_length)


        def convertToDB(x):
            return librosa.core.amplitude_to_db(x, ref=1.0, amin=1e-20, top_db=80.0)


        def convertToAmp(x,):
            return librosa.core.db_to_amplitude(x, ref=1.0)


        def ISTFT(y, step=hop_length, window=win_length):
            return librosa.istft(y, step, window)


        def spectrogram(signal):
            # Generate spectrogram and convert to db
            stft = STFT(signal, n_fft, hop_length, win_length)
            stft_db = convertToDB(abs(stft))

            return stft, stft_db


        def threshold(noise_stft_db, n=2.0):
            # Calculate statistics of noise
            mean_freq_noise = np.mean(noise_stft_db, axis=1)
            std_freq_noise = np.std(noise_stft_db, axis=1)
            noise_thresh = mean_freq_noise + std_freq_noise * n 

            # Reshape and extend mask across full recording
            reshaped = np.reshape(noise_thresh, (1,len(noise_thresh)))
            repeats = np.shape(sig_stft_db)[1]

            thresh = np.repeat(reshaped, repeats, axis=0).T

            return thresh


        def autoThreshold(sig_stft_db, window=50, step=25, n=3.0):
            thres = []

            # Find threshold for each frequency band
            for j,row in enumerate(sig_stft_db):
                min_std = 1000
                min_mean = 0
                min_index = 0

                for i in range(0,len(row),step):
                    mean = np.mean(row[i:i+window])
                    std = np.std(row[i:i+window])

                    if std < min_std:
                        min_std = std
                        min_mean = mean
                        min_index = i
                
                t = min_mean + min_std * n
                thres.append(t)

            # Reshape and extend mask across full recording
            reshaped = np.reshape(thres, (1,len(thres)))
            repeats = np.shape(sig_stft_db)[1]
            thres = np.repeat(reshaped, repeats, axis=0).T

            return thres


        def mask(db_thresh, sig_stft, sig_stft_db):
            # Smoothing filter and normalise
            smooth = np.ones((5,9)) * 0.5
            smooth = smooth / np.sum(smooth)

            # mask if the signal is above the threshold
            mask = sig_stft_db < db_thresh

            # convolve the mask with a smoothing filter
            mask = fftconvolve(mask, smooth, mode="same")
            mask = mask * 1.0

            # mask the signal
            gain = np.min(convertToDB(np.abs(sig_stft)))

            masked = (sig_stft_db * (1 - mask) +  gain * mask)

            return masked, mask


        def reconstruct(masked, recording):
            reconstructed = convertToDB(abs(convertToAmp(masked)))
            original = convertToDB(abs(STFT(recording, n_fft, hop_length, win_length)))

            return reconstructed, original

        url = data['url']

        url = '../audio/' + url[url.find('8000/')+5:]
        print(f'The URL is: {url}')

        recording, sample_rate = librosa.load(url, sr=None)

        sig_stft, sig_stft_db = spectrogram(recording)

        thresh = autoThreshold(sig_stft_db)

        masked, mask = mask(thresh, sig_stft, sig_stft_db)

        reconstructed, original = reconstruct(masked, recording)

        denoised = convertToAmp(reconstructed)
        denoised = ISTFT(denoised)

        wave.write('denoised-temp.wav', rate = sample_rate, data = denoised)
        data =  wave.read('denoised-temp.wav')
        f =  open('denoised-temp.wav', 'rb')

        testfile = File(f)

        AudioFile.objects.filter(title__contains='denoised_temp').delete()

        AudioFile.objects.create(
            title = 'denoised_temp'
        )
        denoisedtemp = AudioFile.objects.get(title__contains='denoised_temp')
        denoisedtemp.filedata.save('denoised_temp', testfile)
        print(denoisedtemp.title)

        # sf.write('/denoised.wav', denoised, sample_rate)

        return HttpResponse('success')