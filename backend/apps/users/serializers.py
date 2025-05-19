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

class RegisterSerializer(serializers.ModelSerializer):
    # Require password write-only; you could add password2
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # Include any other fields you want users to supply, e.g. email
        fields = ['username', 'password']
    
    def create(self, validated_data):
        """
        Use Django's create_user method so the password is hashed.
        """
        return User.objects.create_user(**validated_data)