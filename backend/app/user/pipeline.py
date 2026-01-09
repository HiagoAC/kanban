from django.contrib.auth import get_user_model
from .services import create_user_with_board

User = get_user_model()

PROVIDER_FIELD_MAP = {
    "google-oauth2": {
        "first_name": "given_name",
        "last_name": "family_name",
        "email": "email",
        "avatar_url": "picture",
    },
}


def create_user_with_board_pipeline(
        strategy, details, backend, user=None, *args, **kwargs):
    """Custom social auth pipeline step to create user with default board."""
    if user is None:
        username = details.get('username') or details.get('email')
        if not username:
            return
        if User.objects.filter(username=username).exists():
            return
        user = create_user_with_board(username=username)
        return {
            'is_new': True,
            'user': user
        }

    return {'is_new': False, 'user': user}


def sync_user_details(backend, user, response, *args, **kwargs):
    """Sync user details from social auth provider to User model."""
    provider = backend.name
    field_map = PROVIDER_FIELD_MAP.get(provider, {})
    for user_field, response_field in field_map.items():
        value = response.get(response_field)
        if value:
            setattr(user, user_field, value)
    user.save()
