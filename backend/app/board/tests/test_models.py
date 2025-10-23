
from django.utils import timezone
from django.test import TestCase
from django.contrib.auth import get_user_model

from board.models import Board


User = get_user_model()


class BoardModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser@example.com')

    def test_create_board(self):
        """Test creating a Board instance."""
        title = 'Test Board'
        board = Board.objects.create(
            user=self.user,
            title=title
        )

        self.assertIsInstance(board, Board)
        self.assertEqual(board.title, title)

    def test_created_at_is_auto_set(self):
        """Test that created_at is automatically set on creation."""
        start_time = timezone.now()
        board = Board.objects.create(
            user=self.user,
            title='Test Board',
        )
        end_time = timezone.now()

        self.assertTrue(start_time <= board.created_at <= end_time)

    def test_str_representation(self):
        """Test the string representation of the Board model."""
        title = 'Test Board'
        board = Board.objects.create(
            user=self.user,
            title=title
        )

        self.assertEqual(str(board), title)
