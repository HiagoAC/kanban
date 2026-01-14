from datetime import timedelta
from django.utils import timezone
from django.db.models import Count, Exists, OuterRef
from django.contrib.auth import get_user_model
from card.models import Card

User = get_user_model()


def cleanup_unused_guests(
        grace_period: timedelta, dry_run: bool = False) -> int:
    """
    Delete guest users older than grace_period that have not meaningfully
    used their account.
    """
    cutoff = timezone.now() - grace_period
    base_query = User.objects.filter(
        is_guest=True,
        date_joined__lt=cutoff,
        board__is_default=True,
    )

    single_board_users = base_query.annotate(
        board_count=Count("board")
    ).filter(board_count=1)

    has_cards = Exists(
        Card.objects.filter(column__board=OuterRef('board'))
    )

    users_to_delete = single_board_users.exclude(has_cards)
    count = users_to_delete.count()

    if dry_run:
        return count

    users_to_delete.delete()
    return count
