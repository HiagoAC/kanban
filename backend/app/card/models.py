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
    body = models.TextField(blank=True)
    priority = models.CharField(
        max_length=10,
        choices=PriorityChoices.choices,
        default=PriorityChoices.MEDIUM
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    order_with_respect_to = 'column'

    class Meta(OrderedModel.Meta):
        constraints = [
            models.CheckConstraint(
                check=models.Q(priority__in=PriorityChoices.values),
                name='valid_priority_choice'
            )
        ]

    def __str__(self):
        return self.title
