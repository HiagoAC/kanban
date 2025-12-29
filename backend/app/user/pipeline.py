from django.contrib.auth import get_user_model
from .services import create_user_with_board

User = get_user_model()


def create_user_with_board_pipeline(strategy, details, backend, user=None, *args, **kwargs):
    """Custom social auth pipeline step to create user with default board."""
    if user is None:
        username = details.get('username') or details.get('email')
        if not username:
            return
        
        if User.objects.filter(username=username).exists():
            return
        
        user = create_user_with_board(username=username, password=None)
        
        return {
            'is_new': True,
            'user': user
        }
    
    return {'is_new': False, 'user': user}
