from ninja import Field, FilterSchema, ModelSchema, Schema

from card.models import Card


class CardIn(Schema):
    """Base schema for Card."""
    title: str
    body: str | None = None
    priority: str | None = None
    column_id: int


class CardListSchema(Schema):
    """Schema for listing cards."""
    id: int
    title: str
    priority: str


class CardOut(ModelSchema):
    """Base schema for Card model."""
    board_id: int | None = None
    column_id: int | None = None

    class Meta:
        model = Card
        fields = [
            'id',
            'title',
            'body',
            'priority',
            'created_at',
            'updated_at'
        ]

    @classmethod
    def from_card(cls, card: Card):
        obj = cls.from_orm(card)
        obj.board_id = card.column.board.id
        obj.column_id = card.column.id
        return obj


class CardFilter(FilterSchema):
    """Schema for card filters."""
    column_id: int | None = Field(None, q='column__id')
