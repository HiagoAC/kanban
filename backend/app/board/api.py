from typing import List
from ninja import Router

from board.schemas import BoardIn, BoardOut, BoardListSchema
from board.models import Board, Column


board_router = Router()


@board_router.get('/', response=List[BoardListSchema],
                  url_name='boards')
def list_boards(request):
    """Retrieve list of user's boards."""
    queryset = Board.objects.filter(user=request.auth).order_by('title')
    return queryset


@board_router.post('/', response={201: BoardOut})
def create_board(request, payload: BoardIn):
    """Create a new board."""
    board_model = Board.objects.create(
        user=request.auth,
        title=payload.title,
    )
    for column_title in payload.columns:
        Column.objects.create(board=board_model, title=column_title)
    board_out = BoardOut.from_orm_with_columns(board_model)
    return 201, board_out


@board_router.get('/{board_id}/', response=BoardOut, url_name='board-detail')
def retrieve_board(request, board_id: int):
    """Retrieve a board."""
    board_model = Board.objects.get(id=board_id, user=request.auth)
    board_out = BoardOut.from_orm_with_columns(board_model)
    return board_out
