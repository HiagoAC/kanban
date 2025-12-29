from django.test import TestCase
from django.contrib.auth import get_user_model

from board.models import Board, Column
from user.services import create_user_with_board

User = get_user_model()


class UserServicesTests(TestCase):
    def test_create_user_with_board(self):
        """Test"""
        username = 'newuser'
        password = 'newpass'
        user = create_user_with_board(
            username=username,
            password=password
        )

        self.assertIsInstance(user, User)
        self.assertEqual(user.username, username)
        self.assertTrue(user.check_password(password))

        self.assertEqual(Board.objects.filter(user=user).count(), 1)

        board = Board.objects.filter(user=user).first()
        self.assertEqual(board.title, "Kanban Board")
        self.assertEqual(Column.objects.filter(board=board).count(), 3)

        expected_column_titles = {'To Do', 'In Progress', 'Done'}
        actual_column_titles = set(
            Column.objects.filter(board=board).values_list('title', flat=True)
        )
        self.assertEqual(actual_column_titles, expected_column_titles)
