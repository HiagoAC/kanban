from typing import List
from ninja import Query, Router

from card.schemas import CardFilter, CardListSchema
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
