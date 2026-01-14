from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """Custom user model with additional fields."""
    avatar_url = models.URLField(blank=True, null=True, max_length=500)
    is_guest = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['is_guest', 'date_joined']),
        ]

    def __str__(self):
        return self.username
