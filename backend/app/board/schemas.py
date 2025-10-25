from ninja import ModelSchema, Schema
from typing import List

from board.models import Board


class BoardListSchema(Schema):
    id: int
    title: str


class BoardIn(Schema):
    title: str
    columns: List[str]


class BoardOut(ModelSchema):
    class Meta:
        model = Board
        fields = "__all__"
