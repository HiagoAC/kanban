from django.contrib.auth import get_user_model
from .create_default_board import create_default_board

User = get_user_model()


def create_user_with_board(username: str):
    """ Create a new user and initialize a default Kanban board for them."""
    user = User.objects.create_user(username=username)
    user.set_unusable_password()
    user.save()
    create_default_board(user)
    return user
