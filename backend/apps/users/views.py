from django.shortcuts import render
from rest_framework import viewsets, permissions
from .models import Profile
from .serializers import ProfileSerializer

# Create your views here.
class ProfileViewSet(viewsets.ModelViewSet):
    """
    list:
    Return a list of all profiles.

    create:
    Create a new profile. 'user' is set automatically from the authenticated user.

    retrieve:
    Return a specific profile.
    """
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        # Set the user field to the current user on creation
        serializer.save(user=self.request.user)


