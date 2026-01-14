from django.db import models
from ordered_model.models import OrderedModel  # type: ignore
from django.contrib.auth import get_user_model

User = get_user_model()


class Board(OrderedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    starred = models.BooleanField(default=False)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    order_with_respect_to = 'user'

    class Meta(OrderedModel.Meta):
        indexes = [
            models.Index(
                fields=['user', 'is_default'],
                name='board_user_default_idx',
            )
        ]

    def __str__(self):
        return self.title


class Column(OrderedModel):
    board = models.ForeignKey(
        Board, on_delete=models.CASCADE, related_name="columns"
    )
    title = models.CharField(max_length=255)
    order_with_respect_to = 'board'

    def __str__(self):
        return self.title

    def _touch_board(self):
        self.board.save(update_fields=['updated_at'])

    def save(self, *args, **kwargs):
        self._touch_board()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self._touch_board()
        super().delete(*args, **kwargs)

    class Meta(OrderedModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=['board', 'title'],
                name='unique_column_title_per_board'
            )
        ]
