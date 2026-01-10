from django.http import HttpRequest
from ninja.security import django_auth
from ninja.security.apikey import APIKeyCookie
from django.contrib.auth import get_user_model
from user.services import create_guest_user

User = get_user_model()


class AuthHandler(APIKeyCookie):
    """
    Handles authentication for both registered users and guest users.

    Provides a fallback authentication system that creates a guest user for
    unauthenticated requests.
    """
    def authenticate(self, request: HttpRequest, key: str | None = None):
        user = django_auth(request)
        if user:
            return user
        return self._resolve_or_create_guest(request)

    def _resolve_or_create_guest(self, request):
        guest_user_id = request.session.get('guest_user_id')

        if guest_user_id:
            try:
                user = User.objects.get(id=guest_user_id, is_guest=True)
                return user
            except User.DoesNotExist:
                pass

        guest_user = create_guest_user()
        request.session['guest_user_id'] = guest_user.id
        return guest_user
