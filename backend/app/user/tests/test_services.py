from django.test import TestCase
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

from board.models import Board, Column
from user.services import (
    create_guest_user,
    create_user_with_board,
    create_default_board,
    merge_guest_user,
    cleanup_stale_guests
)

User = get_user_model()


class UserServicesTests(TestCase):
    def test_create_user_with_board(self):
        """Test"""
        username = 'newuser'
        user = create_user_with_board(
            username=username
        )

        self.assertIsInstance(user, User)
        self.assertEqual(user.username, username)

        self.assertEqual(Board.objects.filter(user=user).count(), 1)

        board = Board.objects.filter(user=user).first()
        self.assertEqual(board.title, "Kanban Board")
        self.assertTrue(board.is_default)
        self.assertEqual(Column.objects.filter(board=board).count(), 3)

        expected_column_titles = {'To Do', 'In Progress', 'Done'}
        actual_column_titles = set(
            Column.objects.filter(board=board).values_list('title', flat=True)
        )
        self.assertEqual(actual_column_titles, expected_column_titles)

    def test_create_guest_user(self):
        """Test creating a guest user with a default Kanban board."""
        user = create_guest_user()

        self.assertIsInstance(user, User)
        self.assertTrue(user.is_guest)

        self.assertEqual(Board.objects.filter(user=user).count(), 1)

        board = Board.objects.filter(user=user).first()
        self.assertEqual(board.title, "Kanban Board")
        self.assertTrue(board.is_default)
        self.assertEqual(Column.objects.filter(board=board).count(), 3)

        expected_column_titles = {'To Do', 'In Progress', 'Done'}
        actual_column_titles = set(
            Column.objects.filter(board=board).values_list('title', flat=True)
        )
        self.assertEqual(actual_column_titles, expected_column_titles)

    def test_create_default_board(self):
        """Test creating a default board for an existing user."""
        user = User.objects.create_user(username='testuser')
        board = create_default_board(user)

        self.assertIsInstance(board, Board)
        self.assertEqual(board.user, user)
        self.assertEqual(board.title, "Kanban Board")
        self.assertTrue(board.is_default)
        self.assertEqual(Column.objects.filter(board=board).count(), 3)

        expected_column_titles = {'To Do', 'In Progress', 'Done'}
        actual_column_titles = set(
            Column.objects.filter(board=board).values_list('title', flat=True)
        )
        self.assertEqual(actual_column_titles, expected_column_titles)


class MergeGuestUserTests(TestCase):
    def setUp(self):
        self.registered_user = User.objects.create_user(
            username='registered_user',
            email='registered@example.com'
        )

        self.guest_user = User.objects.create_user(
            username='guest_user',
            email='guest@example.com',
            is_guest=True
        )

        self.guest_board_1 = Board.objects.create(
            user=self.guest_user,
            title="Guest Board 1"
        )
        self.guest_board_2 = Board.objects.create(
            user=self.guest_user,
            title="Guest Board 2"
        )

    def test_merge_guest_user_transfers_boards(self):
        """Test that guest user boards are transferred to registered user."""
        initial_guest_boards = Board.objects.filter(
            user=self.guest_user).count()
        initial_registered_boards = Board.objects.filter(
            user=self.registered_user).count()
        merge_guest_user(self.guest_user, self.registered_user)
        final_registered_boards = Board.objects.filter(
            user=self.registered_user).count()
        self.assertEqual(
            final_registered_boards,
            initial_registered_boards + initial_guest_boards)
        self.assertEqual(Board.objects.filter(
            user_id=self.guest_user.id).count(), 0)

    def test_merge_guest_user_deletes_guest_user(self):
        """Test that the guest user is deleted after merge."""
        guest_user_id = self.guest_user.id
        merge_guest_user(self.guest_user, self.registered_user)
        self.assertFalse(User.objects.filter(id=guest_user_id).exists())

    def test_merge_guest_user_with_no_boards(self):
        """Test merging a guest user with no boards."""
        guest_with_no_extra_boards = User.objects.create_user(
            username='guest_no_boards',
            email='guest_no_boards@example.com',
            is_guest=True
        )
        guest_user_id = guest_with_no_extra_boards.id
        initial_registered_boards = Board.objects.filter(
            user=self.registered_user).count()
        merge_guest_user(guest_with_no_extra_boards, self.registered_user)
        final_registered_boards = Board.objects.filter(
            user=self.registered_user).count()

        self.assertEqual(final_registered_boards, initial_registered_boards)
        self.assertFalse(User.objects.filter(id=guest_user_id).exists())


class CleanupStaleGuestsTests(TestCase):
    def setUp(self):
        """Create test users with different last_login times."""
        self.now = timezone.now()
        self.cutoff = self.now - timedelta(days=30)
        self.fresh_guest = User.objects.create_user(
            username='fresh_guest',
            is_guest=True,
            last_login=self.now - timedelta(days=15)
        )
        self.stale_guest = User.objects.create_user(
            username='stale_guest',
            is_guest=True,
            last_login=self.now - timedelta(days=45)
        )
        self.stale_guest_with_board = User.objects.create_user(
            username='stale_guest_with_board',
            is_guest=True,
            last_login=self.now - timedelta(days=60)
        )
        Board.objects.create(
            user=self.stale_guest_with_board,
            title="Stale Board"
        )
        self.regular_user = User.objects.create_user(
            username='regular_user',
            is_guest=False,
            last_login=self.now - timedelta(days=100)
        )
        self.never_logged_in_guest = User.objects.create_user(
            username='never_logged_in',
            is_guest=True,
            last_login=None
        )

    def test_cleanup_stale_guests_dry_run(self):
        """Test dry run mode doesn't delete anything."""
        initial_count = User.objects.filter(is_guest=True).count()
        deleted_count = cleanup_stale_guests(
            cutoff=self.cutoff,
            dry_run=True
        )

        self.assertEqual(deleted_count, 2)
        self.assertEqual(
            User.objects.filter(is_guest=True).count(),
            initial_count
        )

    def test_cleanup_stale_guests_normal_run(self):
        """Test normal run deletes only stale guests."""
        deleted_count = cleanup_stale_guests(cutoff=self.cutoff)

        self.assertEqual(deleted_count, 2)
        self.assertTrue(User.objects.filter(id=self.fresh_guest.id).exists())
        self.assertFalse(User.objects.filter(id=self.stale_guest.id).exists())
        self.assertFalse(
            User.objects.filter(id=self.stale_guest_with_board.id).exists()
        )
        self.assertTrue(User.objects.filter(id=self.regular_user.id).exists())
        self.assertTrue(
            User.objects.filter(id=self.never_logged_in_guest.id).exists()
        )

    def test_cleanup_stale_guests_cascades_deletion(self):
        """Test that related boards are deleted when users are deleted."""
        board_id = Board.objects.get(user=self.stale_guest_with_board).id
        cleanup_stale_guests(cutoff=self.cutoff)

        self.assertFalse(Board.objects.filter(id=board_id).exists())

    def test_cleanup_stale_guests_edge_case_exact_cutoff(self):
        """Test user with last_login exactly at cutoff is not deleted."""
        exact_cutoff_guest = User.objects.create_user(
            username='exact_cutoff',
            is_guest=True,
            last_login=self.cutoff
        )

        deleted_count = cleanup_stale_guests(cutoff=self.cutoff)

        self.assertTrue(User.objects.filter(id=exact_cutoff_guest.id).exists())
        self.assertEqual(deleted_count, 2)
