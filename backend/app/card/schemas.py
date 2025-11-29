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
    column_id: int

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


class CardFilter(FilterSchema):
    """Schema for card filters."""
    column_id: int | None = Field(None, q='column__id')
