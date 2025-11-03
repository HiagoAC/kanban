from ninja import Field, FilterSchema, Schema


class CardListSchema(Schema):
    id: int
    title: str
    priority: str


class CardFilter(FilterSchema):
    """Schema for card filters."""
    column: str | None = Field(None, q='column__id')
