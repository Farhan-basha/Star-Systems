from rest_framework import serializers
from .models import Workspace, Channel, DirectMessageGroup, Message
from django.contrib.auth import get_user_model

User = get_user_model()

# ✅ Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )

# ✅ User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

# ✅ Workspace Serializer
class WorkspaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Workspace
        fields = ["id", "name", "description", "created_at"]

# ✅ Channel Serializer
class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ["id", "workspace", "name", "description", "created_at"]

    def validate(self, data):
        workspace = data.get("workspace")
        name = data.get("name")
        if Channel.objects.filter(name=name, workspace=workspace).exists():
            raise serializers.ValidationError("Channel with this name already exists in this workspace.")
        return data

# ✅ Direct Message Group Serializer
class DirectMessageGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = DirectMessageGroup
        fields = ["id", "name", "participants", "created_at"]

# ✅ Message Serializer
class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    sender_username = serializers.CharField(source="sender.username", read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "channel",
            "dm_group",
            "sender",
            "sender_username",
            "content",
            "timestamp",
            "is_read"
        ]
