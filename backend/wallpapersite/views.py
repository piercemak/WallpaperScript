import os
from django.http import JsonResponse

def get_wallpaper_images(request):
    wallpapers_dir = "/Users/faraimakombe/Desktop/Wallpapers"
    image_files = [
        f"http://localhost:8000/media/wallpapers/{file}"
        for file in os.listdir(wallpapers_dir)
        if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp"))
    ]
    return JsonResponse(image_files, safe=False)
