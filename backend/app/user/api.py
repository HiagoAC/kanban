from ninja import Router

from user.schemas import UserSchema

me_router = Router()


@me_router.get('/', response={200: UserSchema}, url_name='me')
def get_current_user(request):
    """Retrieve the currently authenticated user's details."""
    user = request.auth
    return user
