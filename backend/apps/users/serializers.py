from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Profile

User = get_user_model()

class ProfileSerializer(serializers.ModelSerializer):
    # Show the username in the output, and make it read-only
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Profile
        fields = ['id', 'user', 'bio']
