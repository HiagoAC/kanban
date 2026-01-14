from django.contrib.auth import get_user_model

User = get_user_model()


def cleanup_stale_guests(cutoff, dry_run: bool = False) -> int:
    """Delete guest users inactive since `cutoff`."""
    qs = User.objects.filter(
        is_guest=True,
        last_login__lt=cutoff,
    )
    count = qs.count()
    if dry_run or count == 0:
        return count

    qs.delete()

    return count
