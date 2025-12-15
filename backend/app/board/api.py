from typing import List
from ninja import Router

from board.schemas import (
    ColumnBase,
    BoardIn,
    BoardOut,
    BoardListSchema,
    BoardUpdate,
    ColumnMoveBeforeIn,
)
from board.models import Board, Column


board_router = Router()


@board_router.get('/', response=List[BoardListSchema],
                  url_name='boards')
def list_boards(request):
    """Retrieve list of user's boards."""
    queryset = Board.objects.filter(user=request.auth)
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


@board_router.get('/latest/', response=BoardOut, url_name='latest-board')
def retrieve_latest_board(request):
    """Retrieve the latest updated board."""
    board_model = Board.objects.filter(
        user=request.auth).order_by('-updated_at').first()
    if not board_model:
        return 404, {"detail": "No boards found."}
    board_out = BoardOut.from_orm_with_columns(board_model)
    return board_out


@board_router.get('/{board_id}/', response=BoardOut, url_name='board-detail')
def retrieve_board(request, board_id: int):
    """Retrieve a board."""
    board_model = Board.objects.get(id=board_id, user=request.auth)
    board_out = BoardOut.from_orm_with_columns(board_model)
    return board_out


@board_router.patch('/{board_id}/', response=BoardOut)
def update_board(request, board_id: int, payload: BoardUpdate):
    """Update a board."""
    board = Board.objects.get(id=board_id, user=request.auth)
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(board, field, value)
    board.save()
    board_out = BoardOut.from_orm_with_columns(board)
    return board_out


@board_router.delete('/{board_id}/', response={204: None})
def delete_board(request, board_id: int):
    """Delete a board."""
    board = Board.objects.get(id=board_id, user=request.auth)
    board.delete()
    return 204, None


@board_router.post('/{board_id}/columns/', response=BoardOut,
                   url_name='columns')
def add_column(request, board_id: int, payload: ColumnBase):
    """Add a new column to a board."""
    board = Board.objects.get(id=board_id, user=request.auth)
    Column.objects.create(board=board, title=payload.title)
    board_out = BoardOut.from_orm_with_columns(board)
    return board_out


@board_router.delete('/{board_id}/columns/{column_id}/', response={204: None},
                     url_name='column-detail')
def delete_column(request, board_id: int, column_id: int):
    """Delete a column from a board."""
    board = Board.objects.get(id=board_id, user=request.auth)
    column = Column.objects.get(id=column_id, board=board)
    column.delete()
    return 204, None


@board_router.patch('/{board_id}/columns/{column_id}/', response=BoardOut,
                    url_name='column-detail')
def update_column(request, board_id: int, column_id: int, payload: ColumnBase):
    """Update a column from a board."""
    board = Board.objects.get(id=board_id, user=request.auth)
    column = Column.objects.get(id=column_id, board=board)
    for field, value in payload.dict(exclude_unset=True).items():
        setattr(column, field, value)
    column.save()
    board_out = BoardOut.from_orm_with_columns(board)
    return board_out


@board_router.post('/{board_id}/columns/{column_id}/move-before/',
                   response={200: None, 404: dict},
                   url_name='column-move-before')
def move_column_before(
        request, board_id: int, column_id: int, payload: ColumnMoveBeforeIn):
    """Move a column before another column."""
    target_column_id = payload.target_column_id
    try:
        column = Column.objects.get(
            id=column_id, board__id=board_id, board__user=request.auth)
        target_column = Column.objects.get(
            id=target_column_id, board__id=board_id, board__user=request.auth)
        if column.board != target_column.board:
            return 404, {"detail": "Target column must be in the same board."}
    except Column.DoesNotExist:
        return 404, {"detail": "Column not found."}
    column.above(target_column)
    return 200, None


@board_router.post('/{board_id}/columns/{column_id}/move-end/',
                   response={200: None, 404: dict},
                   url_name='column-move-end')
def move_column_to_end(request, board_id: int, column_id: int):
    """Move a column to the end of its board."""
    try:
        column = Column.objects.get(
            id=column_id, board__user=request.auth)
    except Column.DoesNotExist:
        return 404, {"detail": "Column not found."}
    column.bottom()
    return 200, None
