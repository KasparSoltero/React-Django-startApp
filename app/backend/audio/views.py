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
from django.core.serializers.json import DjangoJSONEncoder

from scipy import signal
import scipy.io.wavfile as wave



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


def getModel(request):
    return HttpResponse('succes')


def UploadFilesView(request):
    if request.method == 'POST':
        data = request.POST

        AudioFile.objects.create(
            title = data['title'],
            filedata = request.FILES['file']
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


def addDenoised(request):
    #denoises and downsamples to 16k

    if request.method == 'POST':

        audioID = request.POST['id']
        
        audioObject = AudioFile.objects.get(id=audioID)

        recording, sample_rate = librosa.load(audioObject.filedata, sr=None)

        audioObject.duration = round(len(recording)/sample_rate, 2)

        denoisedRecording = denoise(recording)

        denoisedRecording = downsample(denoisedRecording, sample_rate, rate=16000)

        # need to adjust denoised recording samplerate to conserve clip duration, denoised length is different to original length!

        wave.write('denoised-temp.wav', rate = 16000, data = denoisedRecording)

        # print(f'{audioObject} sample rate is {sample_rate}')
        # recording = downsample(recording, sample_rate, rate=16000)
        # wave.write('denoised-temp.wav', rate = 16000, data = recording)
        
        #change file form into one django can handle
        f =  open('denoised-temp.wav', 'rb')
        denoisedRecording = File(f)

        denoisedTitle = audioObject.title.split('.wav')[0] + '_denoised.wav'

        #save downsampled and denoised audiofile to 
        audioObject.denoisedFile.save(denoisedTitle, denoisedRecording)

        return HttpResponse('success')


def denoise(recording):
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


    sig_stft, sig_stft_db = spectrogram(recording)

    thresh = autoThreshold(sig_stft_db)

    masked, mask = mask(thresh, sig_stft, sig_stft_db)

    reconstructed, original = reconstruct(masked, recording)

    denoised = convertToAmp(reconstructed)
    denoised = ISTFT(denoised)

    return denoised


def downsample(recording, sample_rate, rate=16000):
    if sample_rate != rate:
            print(f'length of recording is {len(recording)}')
            N = round((len(recording) * rate)/ sample_rate)
            print(f'length of **adjusted recording is {len(recording) * rate/sample_rate}')
            print(f'length of **rounded **adjusted recording is {N}')
            recording = signal.resample(recording, N)
            print(f'downsampled to {rate}')

    return recording


def addReferenceTemp(request):
    if request.method == 'POST':

        data = request.POST

        Referenceclip.objects.create(
            title = data['title'],
            audiofile = request.FILES['file']
        )

        return HttpResponse('success')


def updateHighlight(request):
    if request.method == 'POST':

        hl = Noiseclip.objects.get(pk=request.POST['id'])

        hl.startTime = request.POST['start']
        hl.endTime = request.POST['end']
        hl.save()

        return HttpResponse('edited highlight')


def getRelatedNoiseclips(request):
    if request.method == 'POST':

        audioId = request.POST['id']
        parentAudioObject = AudioFile.objects.get(pk=audioId)
        Noiseclips = Noiseclip.objects.filter(parentAudio=parentAudioObject)

        responseArray = list(Noiseclips.values())

        # add color of associated call type to response array:
        # e.g possum calls are red, cat calls are green
        for i, nc in enumerate(Noiseclips):
            responseArray[i]['color'] = nc.referenceAudio.color
            if responseArray[i]['color'] == 'none':
                responseArray[i]['color'] = 'rgba(100,100,100,0.3)'

            responseArray[i]['referenceTitle'] = nc.referenceAudio.title

        return HttpResponse(json.dumps(responseArray, cls=DjangoJSONEncoder))


def convolveAudio(request):
    if request.method == 'POST':

        audioID = request.POST['id']

        audioObject = AudioFile.objects.get(id=audioID)

        sampleRate, s = wave.read(audioObject.denoisedFile)

        def extract():
            # Extract recordings, repalce with SD card directory
            masks = []
            calls = []

            for ref in Referenceclip.objects.all():
                sampleRate, data = wave.read(ref.audiofile)
                data = np.array(data)
                calls.append(ref.title)
                masks.append(data)

            return masks, calls


        def spectrograms(recording, sampleRate, plot=False):
            # Plot spectrograms of recording and ref
            fp, tp, Sp = signal.spectrogram(recording, fs=sampleRate)

            return Sp


        def normalise(mask):
            # Normalise to prevent higher energy masks becoming biased
            norm = np.linalg.norm(mask)
            mask = np.divide(mask, norm)
            mask = mask / mask.sum()
            return mask


        def correlation(recording, masks, sampleRate):
            # Convolve spectrogram with ref to generate correlation
            Sp = spectrograms(recording, sampleRate)

            # Normalisation
            Sp = normalise(Sp)

            kernel = np.ones((2,2)) * 0.5

            cor = []
            scaled = []

            lower = 0
            upper = 0

            for mask in masks:
                # Normalise Mask
                mask = spectrograms(mask, sampleRate)
                mask = normalise(mask)

                # Smoothing (Optional)
                mask = signal.convolve2d(mask, kernel, mode='same', boundary='wrap', fillvalue=0)

                c = signal.correlate(Sp, mask, mode="valid")

                if c.min() < lower:
                    lower = c.min()
                if c.max() > upper:
                    upper = c.max()
                
                cor.append(c[0])

            # Scale correlation relative to upper and lower values
            for c in cor:
                c = np.interp(c, (lower,upper), (0,1)) 
                scaled.append(c)

            return scaled


        def dilation(recommend, k=200):
            # Expand binary mask to include surrounding areas
            d = []
            for i in range(len(recommend)):
                if any(recommend[i-k:i+k]) == 1:
                    d.append(1)
                else:
                    d.append(0)
            return d


        def findRegions(correlation, threshold=0.3):
            # Find the regions of interest
            regions = []
            for cor in correlation:
                recommend = []
                for c in cor:
                    if c >= threshold:
                        recommend.append(1) # append highest correlation for that region
                    else:
                        recommend.append(0)

                regions.append(dilation(recommend))

            return regions


        def extractTimeStamp(masks, sampleRate):
            # Return time stamp of regions of interest
            stamp = []
            for mask in masks:
                state = mask[0]
                times = []
                for i,m in enumerate(mask):
                    if m != state:
                        times.append(i)
                        state = m
                stamp.append(times)

            return stamp


        def rank(correlation, stamps, calls):
            # Rank in order of highest correlation
            factor = 226 #0.00021875

            rs = []
            for i,stamp in enumerate(stamps):
                # If length of list is odd add timestamp to end
                if (len(stamp) % 2):
                    stamp.append(len(correlation[i]))

                cor = correlation[i]
                r = []
                for j in range(0,len(stamp),2):
                    
                    maxCorrelation = max(cor[int(stamp[j]):int(stamp[j+1])])
                    r.append((calls[i], (factor*stamp[j],factor*stamp[j+1]), maxCorrelation))

                rs.extend(r)

            # Order in terms of correlation
            rs = sorted(rs, key=lambda x: x[2], reverse=True)

            return rs


        def combine(rank, lim=30000):
            # Combine similar recommendations
            new = []

            for c in rank:
                tc1 = c[1][0]
                tc2 = c[1][1]

                for r in rank:
                    if r[0] != c[0]:
                        t1 = r[1][0]
                        t2 = r[1][1]
                        if ((abs(t1 - tc1) < lim) and (t1 < tc1)):
                            tc1 = t1
                        if ((abs(t2 - tc2) < lim) and (t2 > tc2)):
                            tc2 = t2
                
                new.append(([c[0]], (tc1,tc2), [c[2]]))

            unique = []

            for n in new:
                time = n[1]
                if time not in unique:
                    unique.append(time)

            calls = [1]*len(unique)
            for n in new:
                call = n[0]
                time = n[1]
                i = unique.index(time)
                calls[i] = call

            return unique, calls
                

        def save(signal, timestamps, calls, sample_rate):
            # Save segmented signal
            # timestamps = np.multiply(timestamps,238.5)

            for i,stamp in enumerate(timestamps):
                print(f'stamp: {stamp}')
                print(f'\nlength of signal: {len(signal)}')
                seg = signal[int(stamp[0]):int(stamp[1])]

                #change file form into one django can handle
                wave.write('noiseclip-temp.wav', rate = 16000, data = seg)
                f =  open('noiseclip-temp.wav', 'rb')
                noiseclip = File(f)

                noiseclipTitle = audioObject.title.split('.wav')[0] + f'_clip_{i}.wav'

                call = Referenceclip.objects.get(title=calls[i][0])

                print(f'here are the timestamps for {audioObject}:')
                print(f'startTime: {round(stamp[0] / 16000, 2)}')
                print(f'endTime: {round(stamp[1] / 16000, 2)}')

                newclip = Noiseclip.objects.create(
                    title = noiseclipTitle, 
                    parentAudio = audioObject,
                    referenceAudio = call,
                    startTime = round(stamp[0] / 16000, 2),
                    endTime = round(stamp[1] / 16000, 2)
                    )

                newclip.audiofile.save(noiseclipTitle, noiseclip)

        # Extract masks
        masks, calls = extract()

        # For a given field recording and array of masks generate array of correlations
        cor = correlation(s, masks, sampleRate)

        # Extract regions of interest
        regions = findRegions(cor)

        # Extract time stamps
        stamp = extractTimeStamp(regions, sampleRate)

        # Display correlation/rank with relevant label and time stamp
        r = rank(cor, stamp, calls)

        # Recommendations in similar time ranges are combined
        unique, calls = combine(r)

        save(s, unique, calls, sampleRate)

        return HttpResponse('success')