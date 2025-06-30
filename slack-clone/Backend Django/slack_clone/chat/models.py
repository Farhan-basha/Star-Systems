from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Workspace(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(User, related_name="workspaces")

class Channel(models.Model):
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name="channels", null=True, blank=True)

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    members = models.ManyToManyField(User, related_name="channels")

class DirectMessageGroup(models.Model):
    name = models.CharField(max_length=100, blank=True)  # Optional (e.g., "User1 & User2")
    participants = models.ManyToManyField(User, related_name="dm_groups")
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    # Can belong to a Channel or a Direct Message (DM)
    channel = models.ForeignKey(Channel, on_delete=models.CASCADE, null=True, blank=True, related_name="messages")
    dm_group = models.ForeignKey(DirectMessageGroup, on_delete=models.CASCADE, null=True, blank=True, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.sender.username}: {self.content[:20]}..."