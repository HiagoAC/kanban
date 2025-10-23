from ninja import Schema


class BoardListSchema(Schema):
    id: int
    title: str
