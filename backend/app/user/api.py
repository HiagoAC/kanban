from django.http import HttpResponse
from django.contrib.auth import logout
from ninja import Router

from user.schemas import UserSchema

me_router = Router()
logout_router = Router()


@me_router.get('/', response={200: UserSchema}, url_name='me')
def get_current_user(request):
    """Retrieve the currently authenticated user's details."""
    user = request.auth
    return user


@logout_router.post('/', url_name='logout')
def logout_user(request):
    """Log out the currently authenticated user."""
    logout(request)
    return HttpResponse(status=204)
