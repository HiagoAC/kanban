from django.contrib.auth import get_user_model
from .services import create_default_board, merge_guest_user

User = get_user_model()

PROVIDER_FIELD_MAP = {
    "google-oauth2": {
        "first_name": "given_name",
        "last_name": "family_name",
        "email": "email",
        "avatar_url": "picture",
    },
}


def handle_guest_user(strategy, backend, user=None, *args, **kwargs):
    request = strategy.request
    action = request.session.get("guest_migration_action")
    if not action or not user:
        return

    guest_user_id = request.session.get("guest_user_id")
    if not guest_user_id:
        return
    try:
        guest_user = User.objects.get(id=guest_user_id, is_guest=True)
    except User.DoesNotExist:
        return

    if action == "merge":
        merge_guest_user(guest_user, user)
    elif action == "discard":
        guest_user.delete()


def create_default_board_pipeline(
        strategy, user=None, is_new=False, *args, **kwargs):
    action = strategy.request.session.get("guest_migration_action")
    if is_new and action != "merge":
        create_default_board(user)


def clear_guest_migration_action(strategy, *args, **kwargs):
    request = strategy.request
    if "guest_migration_action" in request.session:
        request.session.pop("guest_migration_action", None)


def sync_user_details(backend, user, response, *args, **kwargs):
    """Sync user details from social auth provider to User model."""
    provider = backend.name
    field_map = PROVIDER_FIELD_MAP.get(provider, {})
    for user_field, response_field in field_map.items():
        value = response.get(response_field)
        if value:
            setattr(user, user_field, value)
    user.save()
