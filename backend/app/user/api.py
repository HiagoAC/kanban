from django.http import HttpResponse
from django.contrib.auth import logout
from ninja import Router
from ninja.security import django_auth

from user.schemas import GuestActionSchema, UserSchema

me_router = Router()
logout_router = Router()
session_router = Router()


@me_router.get('/', response={200: UserSchema}, url_name='me')
def get_current_user(request):
    """Retrieve the currently authenticated user's details."""
    user = request.auth
    return user


@logout_router.post('/', url_name='logout', auth=django_auth)
def logout_user(request):
    """Log out the currently authenticated user."""
    logout(request)
    return HttpResponse(status=204)


@session_router.post('/guest-action/', url_name='set_guest_action', auth=None)
def set_guest_migration_action(request, payload: GuestActionSchema):
    """Store guest migration action in session for social login."""
    request.session["guest_migration_action"] = payload.guest_action
    return HttpResponse(status=204)
