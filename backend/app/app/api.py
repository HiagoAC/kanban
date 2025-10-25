from django.db import IntegrityError
from ninja import NinjaAPI

from board.api import board_router


api = NinjaAPI(urls_namespace='api')

api.add_router('boards/', board_router)


@api.exception_handler(IntegrityError)
def on_integrity_error(request, exc):
    return api.create_response(
        request,
        {"detail": "Invalid data. Please check your input."},
        status=400,
    )
