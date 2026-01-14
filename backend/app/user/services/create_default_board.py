from django.contrib.auth import get_user_model
from board.models import Board, Column

User = get_user_model()


def create_default_board(user):
    """ Create a default Kanban board for the given user. """
    title = "Kanban Board"
    column_titles = ['To Do', 'In Progress', 'Done']

    board = Board.objects.create(user=user, title=title, is_default=True)
    for column_title in column_titles:
        Column.objects.create(board=board, title=column_title)
    return board
