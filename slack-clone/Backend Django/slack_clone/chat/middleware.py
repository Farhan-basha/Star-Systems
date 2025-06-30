from urllib.parse import parse_qs
from channels.middleware import BaseMiddleware  
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model

User = get_user_model()

@database_sync_to_async
def get_user_from_token(token_key):
    try:
        token = AccessToken(token_key)
        return User.objects.get(id=token["user_id"])
    except Exception:
        return AnonymousUser()

class TokenAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        query_string = parse_qs(scope["query_string"].decode())
        token_key = query_string.get("token", [None])[0]

        scope["user"] = await get_user_from_token(token_key)
        return await super().__call__(scope, receive, send)
