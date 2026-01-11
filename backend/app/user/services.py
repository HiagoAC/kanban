import uuid
from django.contrib.auth import get_user_model
from board.models import Board, Column

User = get_user_model()


def create_user_with_board(username: str):
    """ Create a new user and initialize a default Kanban board for them."""
    user = User.objects.create_user(username=username)
    user.set_unusable_password()
    user.save()
    title = "Kanban Board"
    column_titles = ['To Do', 'In Progress', 'Done']

    board = Board.objects.create(user=user, title=title)
    for column_title in column_titles:
        Column.objects.create(board=board, title=column_title)

    return user


def create_guest_user():
    """ Create a guest user with a default Kanban board. """
    guest_username = f"user_{uuid.uuid4().hex[:10]}"
    user = create_user_with_board(guest_username)
    user.is_guest = True
    user.save()
    return user


def merge_guest_user(guest_user, registered_user):
    """ Merge the data from a guest user into a registered user. """
    guest_boards = Board.objects.filter(user=guest_user)
    for board in guest_boards:
        board.user = registered_user
        board.save()
    guest_user.delete()
