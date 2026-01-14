from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from board.models import Board
from card.models import Card
from user.services.cleanup_unused_guests import cleanup_unused_guests
from user.services.create_default_board import create_default_board

User = get_user_model()


class CleanUnusedGuestsTests(TestCase):
    def setUp(self):
        """Set up test data with different user scenarios."""
        self.now = timezone.now()
        self.grace_period = timedelta(hours=24)
        self.old_time = self.now - timedelta(hours=48)
        self.recent_time = self.now - timedelta(hours=12)

    def test_cleanup_basic_unused_guest(self):
        """Test that old unused guest with default setup gets deleted."""
        old_unused_guest = User.objects.create_user(
            username='old_unused_guest',
            is_guest=True,
            date_joined=self.old_time
        )
        create_default_board(old_unused_guest)

        deleted_count = cleanup_unused_guests(grace_period=self.grace_period)

        self.assertEqual(deleted_count, 1)
        self.assertFalse(
            User.objects.filter(id=old_unused_guest.id).exists()
        )

    def test_cleanup_preserves_recent_guests(self):
        """Test that recent guests are preserved regardless of usage."""
        recent_guest = User.objects.create_user(
            username='recent_guest',
            is_guest=True,
            date_joined=self.recent_time
        )
        create_default_board(recent_guest)

        deleted_count = cleanup_unused_guests(grace_period=self.grace_period)

        self.assertEqual(deleted_count, 0)
        self.assertTrue(
            User.objects.filter(id=recent_guest.id).exists()
        )

    def test_cleanup_preserves_guests_with_cards(self):
        """Test that guests with cards are preserved."""
        old_guest_with_cards = User.objects.create_user(
            username='old_guest_with_cards',
            is_guest=True,
            date_joined=self.old_time
        )
        board = create_default_board(old_guest_with_cards)

        column = board.columns.first()
        Card.objects.create(column=column, title="Test Card")

        deleted_count = cleanup_unused_guests(grace_period=self.grace_period)

        self.assertEqual(deleted_count, 0)
        self.assertTrue(
            User.objects.filter(id=old_guest_with_cards.id).exists()
        )

    def test_cleanup_preserves_multiple_boards(self):
        """Test that guests with multiple boards are preserved."""
        old_guest_multi_boards = User.objects.create_user(
            username='old_guest_multi_boards',
            is_guest=True,
            date_joined=self.old_time
        )
        create_default_board(old_guest_multi_boards)

        Board.objects.create(
            user=old_guest_multi_boards,
            title="Second Board"
        )

        deleted_count = cleanup_unused_guests(grace_period=self.grace_period)

        self.assertEqual(deleted_count, 0)
        self.assertTrue(
            User.objects.filter(id=old_guest_multi_boards.id).exists()
        )

    def test_cleanup_preserves_regular_users(self):
        """Test that non-guest users are never deleted."""
        old_regular_user = User.objects.create_user(
            username='old_regular_user',
            is_guest=False,
            date_joined=self.old_time
        )
        create_default_board(old_regular_user)

        deleted_count = cleanup_unused_guests(grace_period=self.grace_period)

        self.assertEqual(deleted_count, 0)
        self.assertTrue(
            User.objects.filter(id=old_regular_user.id).exists()
        )

    def test_cleanup_preserves_non_default_board(self):
        """Test that guests with non-default boards are preserved."""
        old_guest_non_default = User.objects.create_user(
            username='old_guest_non_default',
            is_guest=True,
            date_joined=self.old_time
        )

        Board.objects.create(
            user=old_guest_non_default,
            title="Custom Board",
            is_default=False
        )

        deleted_count = cleanup_unused_guests(grace_period=self.grace_period)

        self.assertEqual(deleted_count, 0)
        self.assertTrue(
            User.objects.filter(id=old_guest_non_default.id).exists()
        )

    def test_cleanup_dry_run_mode(self):
        """Test that dry run returns count but doesn't delete."""
        old_unused_guest = User.objects.create_user(
            username='old_unused_guest_dry',
            is_guest=True,
            date_joined=self.old_time
        )
        create_default_board(old_unused_guest)

        deleted_count = cleanup_unused_guests(
            grace_period=self.grace_period,
            dry_run=True
        )

        self.assertEqual(deleted_count, 1)
        self.assertTrue(
            User.objects.filter(id=old_unused_guest.id).exists()
        )
