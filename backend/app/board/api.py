from typing import List
from ninja import Router
from ninja.security import django_auth

from board.schemas import BoardIn, BoardOut, BoardListSchema
from board.models import Board, Column


board_router = Router(auth=django_auth)


@board_router.get('/', response=List[BoardListSchema],
                  url_name='boards')
def list_boards(request):
    """Retrieve list of user's boards."""
    queryset = Board.objects.filter(user=request.auth).order_by('title')
    return queryset


@board_router.post('/', response={201: BoardOut})
def create_board(request, payload: BoardIn):
    """Create a new board."""
    board = Board.objects.create(
        user=request.auth,
        title=payload.title,
    )
    for column_title in payload.columns:
        Column.objects.create(board=board, title=column_title)
    return 201, board
