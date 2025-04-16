from django.contrib import admin
from django.urls import path
from .views import get_wallpaper_images
from django.conf import settings
from django.conf.urls.static import static


urlpatterns = [
    path("admin/", admin.site.urls),
    path('api/wallpapers/', get_wallpaper_images),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
