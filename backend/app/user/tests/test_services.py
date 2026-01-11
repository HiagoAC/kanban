from django.test import TestCase
from django.contrib.auth import get_user_model

from board.models import Board, Column
from user.services import (
    create_guest_user,
    create_user_with_board,
    merge_guest_user
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
