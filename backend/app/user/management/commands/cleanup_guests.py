from datetime import timedelta
from django.utils import timezone
from django.core.management.base import BaseCommand

from user.services.cleanup_stale_guests import cleanup_stale_guests
from user.services.cleanup_unused_guests import cleanup_unused_guests


class Command(BaseCommand):
    help = "Cleanup stale guest users and unused new accounts"

    def add_arguments(self, parser):
        parser.add_argument(
            "--inactive-days",
            type=int,
            default=14,
            help="Delete guest users inactive for this many days",
        )

        parser.add_argument(
            "--grace-period-new-accounts",
            type=int,
            default=24,
            help="Do not delete accounts newer than this many hours",
        )

        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Show what would be deleted without making changes",
        )

    def handle(self, *args, **options):
        dry_run = options["dry_run"]
        inactive_cutoff = timezone.now() - timedelta(
            days=options["inactive_days"]
        )

        deleted_stale = cleanup_stale_guests(
            cutoff=inactive_cutoff,
            dry_run=dry_run,
        )

        deleted_unused_new = cleanup_unused_guests(
            grace_period=timedelta(
                hours=options["grace_period_new_accounts"]
            ),
            dry_run=dry_run,
        )

        log = (f"Deleted {deleted_stale} stale guests and "
               f"{deleted_unused_new} unused new accounts")
        if dry_run:
            self.stdout.write(self.style.WARNING(
                f"[DRY RUN] "
                f"{log}"
            ))
        else:
            self.stdout.write(self.style.SUCCESS(
                f"{log}"
            ))
