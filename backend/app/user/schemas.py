from ninja import ModelSchema

from django.contrib.auth import get_user_model

User = get_user_model()


class UserSchema(ModelSchema):
    """Base schema for User."""

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'avatar_url'
        ]
