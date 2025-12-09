from typing import List
from ninja import Query, Router, PatchDict

from card.schemas import (
    CardFilter,
    CardListSchema,
    CardIn,
    CardMoveAboveIn,
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


@card_router.post('/{card_id}/move-above/', response={200: None, 404: dict},
                  url_name='card-move-above')
def move_card_above(request, card_id: int, payload: CardMoveAboveIn):
    """Move a card above another card."""
    target_card_id = payload.target_card_id
    try:
        card = Card.objects.get(
            id=card_id, column__board__user=request.auth)
        target_card = Card.objects.get(
            id=target_card_id, column__board__user=request.auth)
        if card.column != target_card.column:
            return 404, {"detail": "Target card must be in the same column."}
    except Card.DoesNotExist:
        return 404, {"detail": "Card not found."}
    card.above(target_card)
    return 200, None


@card_router.post('/{card_id}/move-bottom/', response={200: None, 404: dict},
                  url_name='card-move-bottom')
def move_card_to_bottom(request, card_id: int):
    """Move a card to the bottom of its column."""
    try:
        card = Card.objects.get(
            id=card_id, column__board__user=request.auth)
    except Card.DoesNotExist:
        return 404, {"detail": "Card not found."}
    card.bottom()
    return 200, None
