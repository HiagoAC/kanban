import uuid
from django.contrib.auth import get_user_model

from .create_user_with_board import create_user_with_board

User = get_user_model()


def create_guest_user():
    """ Create a guest user with a default Kanban board. """
    guest_username = f"user_{uuid.uuid4().hex[:10]}"
    user = create_user_with_board(guest_username)
    user.is_guest = True
    user.save()
    return user
