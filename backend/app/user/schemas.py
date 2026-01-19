from ninja import ModelSchema, Schema
from typing import Literal

from django.contrib.auth import get_user_model

User = get_user_model()


class UserSchema(ModelSchema):
    """Base schema for User."""
    id: str

    class Meta:
        model = User
        fields = [
            'id',
            'username',
            'email',
            'first_name',
            'last_name',
            'is_guest',
            'avatar_url'
        ]

    @staticmethod
    def resolve_id(user):
        return str(user.id)


class GuestActionSchema(Schema):
    """Schema for guest migration action."""
    guest_action: Literal['merge', 'discard']
