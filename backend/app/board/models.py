from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Board(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['user', 'title'],
                name='unique_board_title_per_user'
            )
        ]


class Column(models.Model):
    board = models.ForeignKey(Board, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    position = models.DecimalField(max_digits=10, decimal_places=5)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['position']
        constraints = [
            models.UniqueConstraint(
                fields=['board', 'title'],
                name='unique_column_title_per_board'
            )
        ]
