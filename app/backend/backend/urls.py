from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from audio import views

router = routers.DefaultRouter()
router.register('unprocessedaudios', views.UnprocessedAudioView)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('test/', views.TestFunctionView),
    path('uploadfiles/', views.UploadFileView)
]