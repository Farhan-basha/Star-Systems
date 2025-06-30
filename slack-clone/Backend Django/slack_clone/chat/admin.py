from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import Workspace, Channel, DirectMessageGroup, Message

admin.site.register(Workspace)
admin.site.register(Channel)
admin.site.register(DirectMessageGroup)
admin.site.register(Message)