from ninja import ModelSchema, Schema
from typing import Literal

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
            'is_guest',
            'avatar_url'
        ]


class GuestActionSchema(Schema):
    """Schema for guest migration action."""
    guest_action: Literal['merge', 'discard']
