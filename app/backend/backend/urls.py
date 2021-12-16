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
    path('test/', views.TestFunctionView),
    path('uploadfiles/', views.UploadFileView),
    path('retrieve-audio/', views.retrieveAudioView),
    path('get-denoised/', views.getDenoised)
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)