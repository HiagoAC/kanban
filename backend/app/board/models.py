from django.db import models
from ordered_model.models import OrderedModel  # type: ignore
from django.contrib.auth import get_user_model

User = get_user_model()


class Board(OrderedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    order_with_respect_to = 'user'

    def __str__(self):
        return self.title

    class Meta(OrderedModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'title'],
                name='unique_board_title_per_user'
            )
        ]


class Column(OrderedModel):
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    order_with_respect_to = 'board'

    def __str__(self):
        return self.title

    class Meta(OrderedModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=['board', 'title'],
                name='unique_column_title_per_board'
            )
        ]
