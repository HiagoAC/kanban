from django.db import IntegrityError
from django.test import TestCase
from django.contrib.auth import get_user_model

from board.models import Board, Column

User = get_user_model()


class ColumnModelTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser@example.com')
        self.board = Board.objects.create(
            user=self.user,
            title='Test Board'
        )

    def test_create_column(self):
        """Test creating a Column instance."""
        title = 'Test Column'
        column = Column.objects.create(board=self.board, title=title)
        self.assertIsInstance(column, Column)
        self.assertEqual(column.title, title)

    def test_column_str_representation(self):
        """Test the string representation of the Column model."""
        title = 'Test Column'
        column = Column.objects.create(
            board=self.board,
            title=title,
        )
        self.assertEqual(str(column), title)

    def test_title_unique_per_board(self):
        """
        Test that a board cannot have multiple columns with the same title.
        """
        title = 'Test Column'
        Column.objects.create(
            board=self.board,
            title=title,
        )
        with self.assertRaises(IntegrityError):
            Column.objects.create(
                board=self.board,
                title=title,
            )

    def test_different_boards_can_have_same_column_title(self):
        """
        Test that different boards can have columns with the same title.
        """
        title = 'Test Column'
        other_board = Board.objects.create(
            user=self.user,
            title='Other Test Board'
        )
        column1 = Column.objects.create(
            board=other_board,
            title=title,
        )
        column2 = Column.objects.create(
            board=self.board,
            title=title,
        )
        self.assertEqual(column1.title, column2.title)
        self.assertNotEqual(column1.board, column2.board)

    def test_board_updated_at_on_column_creation(self):
        """Test that creating a column updates the board's updated_at field."""
        original_updated_at = self.board.updated_at
        Column.objects.create(
            board=self.board,
            title='New Column',
        )
        self.board.refresh_from_db()

        self.assertGreater(self.board.updated_at, original_updated_at)

    def test_board_updated_at_on_column_modification(self):
        """Test that updating a column updates the board's updated_at field."""
        column = Column.objects.create(
            board=self.board,
            title='Initial Title',
        )
        self.board.refresh_from_db()
        original_updated_at = self.board.updated_at

        column.title = 'Updated Title'
        column.save()
        self.board.refresh_from_db()

        self.assertGreater(self.board.updated_at, original_updated_at)

    def test_board_updated_at_on_column_deletion(self):
        """Test that deleting a column updates the board's updated_at field."""
        column = Column.objects.create(
            board=self.board,
            title='To Be Deleted',
        )
        self.board.refresh_from_db()
        original_updated_at = self.board.updated_at

        column.delete()
        self.board.refresh_from_db()

        self.assertGreater(self.board.updated_at, original_updated_at)
