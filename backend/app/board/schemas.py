from ninja import ModelSchema, Schema
from typing import List

from board.models import Board


class ColumnBase(Schema):
    title: str


class ColumnSchema(ColumnBase):
    id: str


class BoardListSchema(ModelSchema):
    id: str

    class Meta:
        model = Board
        fields = (
            "id",
            "title",
            "starred",
            "created_at",
            "updated_at",
        )

    @staticmethod
    def resolve_id(board):
        return str(board.id)


class BoardIn(Schema):
    title: str
    starred: bool | None = None
    columns: List[str]


class BoardUpdate(Schema):
    title: str | None = None
    starred: bool | None = None


class BoardOut(ModelSchema):
    id: str
    columns: List[ColumnSchema]

    class Meta:
        model = Board
        fields = ("id", "title", "created_at", "updated_at", "starred")

    @staticmethod
    def resolve_id(board):
        return str(board.id)

    @staticmethod
    def resolve_columns(board):
        return [
            ColumnSchema(
                id=str(c.id),
                title=c.title,
            )
            for c in board.columns.all()
        ]


class ColumnMoveBeforeIn(Schema):
    """Schema for moving a column before another column."""
    target_column_id: str
