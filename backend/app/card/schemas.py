from ninja import Field, FilterSchema, ModelSchema, Schema

from card.models import Card


class CardIn(Schema):
    """Base schema for Card."""
    title: str
    body: str = ''
    priority: str | None = None
    column_id: str


class CardListSchema(ModelSchema):
    id: str

    class Meta:
        model = Card
        fields = ["id", "title", "priority"]

    @staticmethod
    def resolve_id(card):
        return str(card.id)


class CardOut(ModelSchema):
    id: str
    board_id: str | None = None
    column_id: str | None = None

    class Meta:
        model = Card
        fields = [
            "id",
            "title",
            "body",
            "priority",
            "created_at",
            "updated_at",
        ]

    @staticmethod
    def resolve_id(card):
        return str(card.id)

    @staticmethod
    def resolve_column_id(card):
        return str(card.column_id) if card.column_id else None

    @staticmethod
    def resolve_board_id(card):
        return str(card.column.board_id) if card.column_id else None


class CardFilter(FilterSchema):
    """Schema for card filters."""
    column_id: str | None = Field(None, q='column__id')


class CardMoveAboveIn(Schema):
    """Schema for moving a card above another card."""
    target_card_id: str
