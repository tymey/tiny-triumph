"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from apps.users.views import ProfileViewSet

urlpatterns = [
    path('admin/', admin.site.urls),
]

# Set up DRF router
router = DefaultRouter()
# Register 'users' prefix to map to ProfileViewSet
router.register(r'users', ProfileViewSet, basename='profile')

# Include all router-generated URLs under /api/
urlpatterns += [
    path('api/', include(router.urls)),
]