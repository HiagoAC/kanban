
from io import StringIO
from unittest.mock import patch
from django.core.management import call_command
from django.test import TestCase
from django.db.utils import OperationalError
from psycopg import OperationalError as PsycopgError


class WaitForDbCommandTests(TestCase):
    def setUp(self):
        sleep_patcher = patch("time.sleep", return_value=None)
        self.addCleanup(sleep_patcher.stop)
        self.mock_sleep = sleep_patcher.start()

        check_patcher = patch("django.core.management.base.BaseCommand.check")
        self.addCleanup(check_patcher.stop)
        self.mock_check = check_patcher.start()

        self.out = StringIO()

    def test_wait_for_db_ready_first_try(self):
        """Test command succeeds immediately if DB is ready on first try."""
        call_command("wait_for_db", stdout=self.out)
        self.assertEqual(self.mock_check.call_count, 1)

    def test_wait_for_db_retries_until_ready(self):
        """
        Test command retries on OperationalError and succeeds after DB is
        ready.
        """
        self.mock_check.side_effect = [OperationalError] * 3 + [None]
        call_command("wait_for_db", stdout=self.out)
        self.assertEqual(self.mock_check.call_count, 4)

    def test_wait_for_db_retries_psycopg2(self):
        """
        Test command retries on psycopg2.OperationalError and succeeds after
        DB is ready.
        """
        self.mock_check.side_effect = [PsycopgError] * 2 + [None]
        call_command("wait_for_db", stdout=self.out)
        self.assertEqual(self.mock_check.call_count, 3)
