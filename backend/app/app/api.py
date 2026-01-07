from django.db import IntegrityError
from ninja import NinjaAPI
from django.http import HttpResponse
from django.views.decorators.csrf import ensure_csrf_cookie

from ninja.security import django_auth
from board.api import board_router
from card.api import card_router
from user.api import me_router
from user.api import logout_router


api = NinjaAPI(urls_namespace='api', auth=django_auth)


api.add_router('boards/', board_router)
api.add_router('cards/', card_router)
api.add_router('me/', me_router)
api.add_router('logout/', logout_router)


@api.get("/csrf", auth=None)
@ensure_csrf_cookie
def get_csrf_token(request):
    return HttpResponse(status=204)


@api.exception_handler(IntegrityError)
def on_integrity_error(request, exc):
    return api.create_response(
        request,
        {"detail": "Invalid data. Please check your input."},
        status=400,
    )
