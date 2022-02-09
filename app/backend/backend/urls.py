from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from audio import views
from django.conf.urls.static import static
from django.conf import settings

router = routers.DefaultRouter()
router.register('unprocessedaudios', views.UnprocessedAudioView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    path('get-model/', views.getModel),
    path('upload-files/', views.UploadFilesView),
    path('update-highlight/', views.updateHighlight),
    path('convolve-audio/', views.convolveAudio),
    path('update-object/', views.updateObject),
    path('get-field-types/', views.getFieldTypes),

    #unused paths
    path('add-denoised/', views.addDenoised),
    path('retrieve-audio/', views.retrieveAudioView),
    path('add-reference-temp/', views.addReferenceTemp),
    path('get-related-noiseclips/', views.getRelatedNoiseclips),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)