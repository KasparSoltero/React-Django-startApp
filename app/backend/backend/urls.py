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
    path('uploadfiles', views.UploadFilesView),
    path('add-denoised/', views.addDenoised),
    path('convolve-audio/', views.convolveAudio),
    path('retrieve-audio/', views.retrieveAudioView),
    path('add-reference-temp/', views.addReferenceTemp),
    path('update-highlight/', views.updateHighlight),
    path('get-related-noiseclips/', views.getRelatedNoiseclips),

    path('get-model', views.getModel)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)