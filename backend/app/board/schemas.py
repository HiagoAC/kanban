from datetime import datetime
from ninja import ModelSchema, Schema
from typing import List

from board.models import Board


class ColumnBase(Schema):
    title: str


class ColumnSchema(ColumnBase):
    id: int


class BoardListSchema(Schema):
    id: int
    title: str
    starred: bool


class BoardIn(Schema):
    title: str
    starred: bool | None = None
    columns: List[str]


class BoardUpdate(Schema):
    title: str | None = None
    starred: bool | None = None


class BoardOut(ModelSchema):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    starred: bool
    columns: List[ColumnSchema]

    class Meta:
        model = Board
        fields = ("id", "title", "created_at", "updated_at", "starred")

    @classmethod
    def from_orm_with_columns(cls, board: Board):
        obj = cls.from_orm(board)
        obj.columns = [ColumnSchema(
            id=c.id, title=c.title) for c in board.columns.all()]
        return obj


class ColumnMoveBeforeIn(Schema):
    """Schema for moving a column before another column."""
    target_column_id: int
