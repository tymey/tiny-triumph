from django.shortcuts import render
from django.contrib.auth import get_user_model
from rest_framework import viewsets, permissions, generics
from .models import Profile
from .serializers import ProfileSerializer, RegisterSerializer

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

class RegisterView(generics.CreateAPIView):
    """
    POST /api/auth/register
    Creates a new User.
    """
    queryset = get_user_model().objects.all()
    permission_classes = [permissions.AllowAny]  # Anyone can sign up
    serializer_class = RegisterSerializer