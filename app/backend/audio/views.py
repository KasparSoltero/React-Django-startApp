from django.shortcuts import render
from rest_framework import viewsets
from .serializers import UnprocessedAudioSerializer
from .models import UnprocessedAudio
from django.views import View
from django.http import HttpResponse
import json

# Create your views here.

class UnprocessedAudioView(viewsets.ModelViewSet):
    serializer_class = UnprocessedAudioSerializer
    queryset = UnprocessedAudio.objects.all()

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