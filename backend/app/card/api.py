from typing import List
from ninja import Query, Router, PatchDict

from card.schemas import (
    CardFilter,
    CardListSchema,
    CardIn,
    CardOut,
)
from card.models import Card


card_router = Router()


@card_router.get('/', response=List[CardListSchema],
                 url_name='cards')
def list_cards(request, filters: CardFilter = Query(...)):
    """Retrieve list of user's cards."""
    queryset = Card.objects.all()
    if filters:
        queryset = filters.filter(queryset)
    queryset = queryset.filter(column__board__user=request.auth)
    return queryset


@card_router.post('/', response={201: CardOut})
def create_card(request, payload: CardIn):
    """Create a new card."""
    card = Card.objects.create(**payload.dict())
    return 201, CardOut.from_card(card)


@card_router.get('/{card_id}/', response={200: CardOut, 404: dict},
                 url_name='card-detail')
def retrieve_card(request, card_id: int):
    """Retrieve a card by ID."""
    try:
        card = Card.objects.get(
            id=card_id, column__board__user=request.auth)
    except Card.DoesNotExist:
        return 404, {"detail": "Card not found."}
    return CardOut.from_card(card)


@card_router.patch('/{card_id}/', response={200: CardOut, 404: dict},
                   url_name='card-detail')
def update_card(request, card_id: int, payload: PatchDict[CardIn]):
    """Update a card by ID."""
    try:
        card = Card.objects.get(
            id=card_id, column__board__user=request.auth)
    except Card.DoesNotExist:
        return 404, {"detail": "Card not found."}
    for attr, value in payload.items():
        setattr(card, attr, value)
    card.save()
    return CardOut.from_card(card)


@card_router.delete('/{card_id}/', response={204: None, 404: dict},
                    url_name='card-detail')
def delete_card(request, card_id: int):
    """Delete a card by ID."""
    try:
        card = Card.objects.get(
            id=card_id, column__board__user=request.auth)
    except Card.DoesNotExist:
        return 404, {"detail": "Card not found."}
    card.delete()
    return 204, None
