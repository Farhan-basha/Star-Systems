from django.shortcuts import render
from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Channel, Message, Workspace, DirectMessageGroup
from .serializers import (
    ChannelSerializer,
    MessageSerializer,
    WorkspaceSerializer,
    DirectMessageGroupSerializer,
    RegisterSerializer,
    UserSerializer,
)

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

User = get_user_model()

# ------------------------ AUTH VIEWS ------------------------

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['username'] = self.user.username
        return data

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterSerializer

# ------------------------ WORKSPACE VIEWS ------------------------

class WorkspaceListCreateView(generics.ListCreateAPIView):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

class WorkspaceRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer
    permission_classes = [permissions.IsAuthenticated]

# ------------------------ CHANNEL VIEWS ------------------------

class ChannelListCreateView(generics.ListCreateAPIView):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [permissions.AllowAny]  # For easier frontend testing

    def create(self, request, *args, **kwargs):
        workspace_id = request.data.get('workspace')
        name = request.data.get('name')

        if Channel.objects.filter(name=name, workspace_id=workspace_id).exists():
            existing_channel = Channel.objects.get(name=name, workspace_id=workspace_id)
            serializer = self.get_serializer(existing_channel)
            return Response(serializer.data, status=200)

        return super().create(request, *args, **kwargs)

class ChannelRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Channel.objects.all()
    serializer_class = ChannelSerializer
    permission_classes = [permissions.AllowAny]

# ------------------------ DM GROUP VIEWS ------------------------

from django.db import models

class DirectMessageGroupListCreateView(generics.ListCreateAPIView):
    serializer_class = DirectMessageGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DirectMessageGroup.objects.filter(participants=self.request.user)

    def create(self, request, *args, **kwargs):
        current_user = request.user
        participant_ids = request.data.get("participants", [])

        if not participant_ids or not isinstance(participant_ids, list):
            return Response({"error": "Invalid participants"}, status=400)

        all_participant_ids = set(participant_ids + [current_user.id])

        existing_groups = DirectMessageGroup.objects.annotate(
            count=models.Count("participants")
        ).filter(count=len(all_participant_ids))

        for group in existing_groups:
            group_ids = set(group.participants.values_list("id", flat=True))
            if group_ids == all_participant_ids:
                serializer = self.get_serializer(group)
                return Response(serializer.data)

        group = DirectMessageGroup.objects.create()
        group.participants.set(all_participant_ids)
        serializer = self.get_serializer(group)
        return Response(serializer.data, status=201)


class DirectMessageGroupRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DirectMessageGroup.objects.all()
    serializer_class = DirectMessageGroupSerializer
    permission_classes = [permissions.IsAuthenticated]

# ------------------------ MESSAGE VIEWS ------------------------

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        channel_id = self.kwargs.get('channel_id')
        dm_group_id = self.kwargs.get('dm_group_id')

        if channel_id:
            return Message.objects.filter(channel_id=channel_id)
        elif dm_group_id:
            return Message.objects.filter(dm_group_id=dm_group_id)
        return Message.objects.none()

    def perform_create(self, serializer):
        channel_id = self.kwargs.get('channel_id')
        dm_group_id = self.kwargs.get('dm_group_id')
        message = None

        if channel_id:
            message = serializer.save(sender=self.request.user, channel_id=channel_id)
        elif dm_group_id:
            message = serializer.save(sender=self.request.user, dm_group_id=dm_group_id)
        else:
            raise ValidationError("Missing channel_id or dm_group_id in URL.")

        # ✅ WebSocket broadcast for channel messages
        if message and channel_id:
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"chat_channel_{channel_id}",
                {
                    "type": "chat.message",
                    "message": MessageSerializer(message).data
                }
            )

class MessageRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

# ------------------------ USER VIEWS ------------------------

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class UserDetailView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

# ------------------------ CHAT ROOM ------------------------

def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name,
        'username': request.user.username
    })
