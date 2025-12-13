from django.db import models
from ordered_model.models import OrderedModel

from board.models import Column


class PriorityChoices(models.TextChoices):
    LOW = 'low', 'Low'
    MEDIUM = 'medium', 'Medium'
    HIGH = 'high', 'High'


class Card(OrderedModel):
    column = models.ForeignKey(
        Column, on_delete=models.CASCADE, related_name="cards"
    )
    title = models.CharField(max_length=255)
    body = models.TextField(blank=True, default='')
    priority = models.CharField(
        max_length=10,
        choices=PriorityChoices.choices,
        default=PriorityChoices.MEDIUM
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    order_with_respect_to = 'column'

    def _touch_board(self):
        self.column.board.save(update_fields=['updated_at'])

    def save(self, *args, **kwargs):
        self._touch_board()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self._touch_board()
        super().delete(*args, **kwargs)

    class Meta(OrderedModel.Meta):
        constraints = [
            models.CheckConstraint(
                condition=models.Q(priority__in=PriorityChoices.values),
                name='valid_priority_choice'
            )
        ]

    def __str__(self):
        return self.title
