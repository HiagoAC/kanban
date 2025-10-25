from decimal import Decimal
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
        data = {'title': 'Test Column', 'position': 1}
        column = Column.objects.create(board=self.board, **data)
        self.assertIsInstance(column, Column)
        self.assertEqual(column.title, data['title'])
        self.assertEqual(column.position, data['position'])

    def test_column_str_representation(self):
        """Test the string representation of the Column model."""
        title = 'Test Column'
        column = Column.objects.create(
            board=self.board,
            title=title,
            position=Decimal('1.0')
        )
        self.assertEqual(str(column), title)

    def test_column_ordering_by_position(self):
        """Test that columns are ordered by their position."""
        column1 = Column.objects.create(
            board=self.board,
            title='Column 1',
            position=Decimal('2.0')
        )
        column2 = Column.objects.create(
            board=self.board,
            title='Column 2',
            position=Decimal('1.0')
        )
        column3 = Column.objects.create(
            board=self.board,
            title='Column 3',
            position=Decimal('3.0')
        )
        columns = list(Column.objects.all())
        self.assertEqual(columns, [column2, column1, column3])

    def test_title_unique_per_board(self):
        """
        Test that a board cannot have multiple columns with the same title.
        """
        title = 'Test Column'
        Column.objects.create(
            board=self.board,
            title=title,
            position=Decimal('1.0')
        )
        with self.assertRaises(IntegrityError):
            Column.objects.create(
                board=self.board,
                title=title,
                position=Decimal('2.0')
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
            position=Decimal('1.0')
        )
        column2 = Column.objects.create(
            board=self.board,
            title=title,
            position=Decimal('1.0')
        )
        self.assertEqual(column1.title, column2.title)
        self.assertNotEqual(column1.board, column2.board)
