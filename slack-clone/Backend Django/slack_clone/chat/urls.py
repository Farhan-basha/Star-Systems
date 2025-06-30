from django.urls import path
from . import views
from .views import LoginView, RegisterView, UserDetailView, UserListView

urlpatterns = [
    # Authentication
    path('login/', LoginView.as_view(), name='token_obtain_pair'),
    path('register/', RegisterView.as_view(), name='register'),

    # Workspace URLs
    path('workspaces/', views.WorkspaceListCreateView.as_view(), name='workspace-list-create'),
    path('workspaces/<int:pk>/', views.WorkspaceRetrieveUpdateDestroyView.as_view(), name='workspace-detail'),

    # Channel URLs
    path('channels/', views.ChannelListCreateView.as_view(), name='channel-list-create'),
    path('channels/<int:pk>/', views.ChannelRetrieveUpdateDestroyView.as_view(), name='channel-detail'),

    # Direct Message Group URLs
    path('users/', UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', UserDetailView.as_view(), name='user-detail'),

    path('dm-groups/', views.DirectMessageGroupListCreateView.as_view(), name='dm-group-list-create'),
    path('dm-groups/<int:pk>/', views.DirectMessageGroupRetrieveUpdateDestroyView.as_view(), name='dm-group-detail'),

    # Message URLs
    path('channels/<int:channel_id>/messages/', views.MessageListCreateView.as_view(), name='channel-messages'),
    path('dm-groups/<int:dm_group_id>/messages/', views.MessageListCreateView.as_view(), name='dm-group-messages'),
    path('messages/<int:pk>/', views.MessageRetrieveUpdateDestroyView.as_view(), name='message-detail'),

    # WebSocket test room (optional)
    path('<str:room_name>/', views.room, name='room'),
]
