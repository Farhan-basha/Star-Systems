from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'^ws/chat/dm_(?P<group_id>\d+)/$', consumers.DirectMessageConsumer.as_asgi()),
    re_path(r'^ws/chat/channel_(?P<channel_id>\d+)/$', consumers.ChannelConsumer.as_asgi()),
]
