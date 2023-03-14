from django.urls import path 
from . import views

urlpatterns = [
    path('recieve-init/', views.getRoutes, name='routes'),
    path('upload-image/', views.upload_image, name='upload_image'),
]