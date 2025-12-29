from django.contrib.auth import get_user_model
from board.models import Board, Column

User = get_user_model()


def create_user_with_board(username: str, password: str):
    """ Create a new user and initialize a default Kanban board for them."""
    user = User.objects.create_user(username=username, password=password)
    title = "Kanban Board"
    column_titles = ['To Do', 'In Progress', 'Done']

    board = Board.objects.create(user=user, title=title)
    for column_title in column_titles:
        Column.objects.create(board=board, title=column_title)

    return user
