from django.db import IntegrityError
from ninja import NinjaAPI

from ninja.security import django_auth
from board.api import board_router
from card.api import card_router
from user.api import me_router


api = NinjaAPI(urls_namespace='api', auth=django_auth)


api.add_router('boards/', board_router)
api.add_router('cards/', card_router)
api.add_router('me/', me_router)


@api.exception_handler(IntegrityError)
def on_integrity_error(request, exc):
    return api.create_response(
        request,
        {"detail": "Invalid data. Please check your input."},
        status=400,
    )
