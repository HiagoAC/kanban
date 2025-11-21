from datetime import datetime
from ninja import ModelSchema, Schema
from typing import List

from board.models import Board


class ColumnSchema(Schema):
    id: int
    title: str


class BoardListSchema(Schema):
    id: int
    title: str


class BoardIn(Schema):
    title: str
    columns: List[str]


class BoardUpdate(Schema):
    title: str | None = None


class BoardOut(ModelSchema):
    id: int
    title: str
    created_at: datetime
    updated_at: datetime
    columns: List[ColumnSchema]

    class Meta:
        model = Board
        fields = ("id", "title", "created_at", "updated_at")

    @classmethod
    def from_orm_with_columns(cls, board: Board):
        obj = cls.from_orm(board)
        obj.columns = [ColumnSchema(
            id=c.id, title=c.title) for c in board.columns.all()]
        return obj
