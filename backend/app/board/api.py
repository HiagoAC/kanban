from typing import List
from ninja import Router
from ninja.security import django_auth

from board.schemas import BoardListSchema
from board.models import Board


board_router = Router(auth=django_auth)


@board_router.get('/', response=List[BoardListSchema],
                  url_name='boards')
def board_list(request):
    """Retrieve list of user's boards."""
    queryset = Board.objects.filter(user=request.auth).order_by('title')
    return queryset
