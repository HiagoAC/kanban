import time
from django.core.management.base import BaseCommand
from django.db.utils import OperationalError
from psycopg import OperationalError as PsycopgError


class Command(BaseCommand):
    """Wait until the database is ready before continuing."""

    def handle(self, *args, **options):
        self.stdout.write("Waiting for database...")
        while True:
            try:
                self.check(databases=['default'])
                break
            except (PsycopgError, OperationalError):
                time.sleep(1)
        self.stdout.write(self.style.SUCCESS("Database is ready!"))
