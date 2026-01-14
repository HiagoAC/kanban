from django.contrib.auth import get_user_model
from board.models import Board

User = get_user_model()


def merge_guest_user(guest_user, registered_user):
    """ Merge the data from a guest user into a registered user. """
    guest_boards = Board.objects.filter(user=guest_user)
    for board in guest_boards:
        board.user = registered_user
        board.save()
    guest_user.delete()
