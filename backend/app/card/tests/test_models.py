from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model

from board.models import Board, Column
from card.models import Card

User = get_user_model()


class CardModelTests(TestCase):
    def setUp(self):
        """Set up column for testing."""
        user = User.objects.create_user(
            username='testuser', password='testpass'
        )
        self.board = Board.objects.create(user=user, title='Test Board')
        self.column = Column.objects.create(
            board=self.board, title='Test Column')

    def test_create_card(self):
        """Test creating a Card instance."""
        title = 'Test Card'
        body = 'This is a test card.'
        card = Card.objects.create(
            title=title,
            body=body,
            column=self.column
        )
        self.assertIsInstance(card, Card)
        self.assertEqual(card.title, title)
        self.assertEqual(card.body, body)
        self.assertEqual(card.column, self.column)

    def test_created_at_is_auto_set(self):
        """Test that created_at is automatically set on creation."""
        start_time = timezone.now()
        card = Card.objects.create(
            title='Test Card',
            column=self.column
        )
        end_time = timezone.now()
        self.assertTrue(start_time <= card.created_at <= end_time)

    def test_updated_at_is_auto_set(self):
        """Test that updated_at is automatically reset on update."""
        card = Card.objects.create(
            title='Test Card',
            body='This is a test card.',
            column=self.column
        )

        creation_time = card.created_at
        start_time = timezone.now()
        card.body = 'Updated body content.'
        card.save()
        end_time = timezone.now()
        self.assertEqual(creation_time, card.created_at)
        self.assertTrue(start_time <= card.updated_at <= end_time)

    def test_priority_default(self):
        """Test that the default priority is 'medium'."""
        card = Card.objects.create(
            title='Test Card',
            column=self.column
        )
        self.assertEqual(card.priority, 'medium')

    def test_priority_choices(self):
        """Test that priority can be set to valid choices only."""
        for priority in ['low', 'medium', 'high']:
            card = Card.objects.create(
                title='Test Card',
                column=self.column,
                priority=priority
            )
            self.assertEqual(card.priority, priority)
        with self.assertRaises(Exception):
            Card.objects.create(
                title='Test Card',
                column=self.column,
                priority='invalid'
            )

    def test_str_representation(self):
        """Test the string representation of the Card model."""
        title = 'Test Card'
        card = Card.objects.create(
            title=title,
            column=self.column
        )
        self.assertEqual(str(card), title)

    def test_board_updated_at_on_card_creation(self):
        """Test that creating a card updates the board's updated_at field."""
        original_updated_at = self.board.updated_at
        Card.objects.create(
            title='New Card',
            column=self.column,
        )
        self.board.refresh_from_db()

        self.assertGreater(self.board.updated_at, original_updated_at)

    def test_board_updated_at_on_card_modification(self):
        """Test that updating a card updates the board's updated_at field."""
        card = Card.objects.create(
            title='Initial Title',
            column=self.column,
        )
        self.board.refresh_from_db()
        original_updated_at = self.board.updated_at

        card.title = 'Updated Title'
        card.save()
        self.board.refresh_from_db()

        self.assertGreater(self.board.updated_at, original_updated_at)

    def test_board_updated_at_on_card_deletion(self):
        """Test that deleting a card updates the board's updated_at field."""
        card = Card.objects.create(
            title='To Be Deleted',
            column=self.column,
        )
        self.board.refresh_from_db()
        original_updated_at = self.board.updated_at

        card.delete()
        self.board.refresh_from_db()

        self.assertGreater(self.board.updated_at, original_updated_at)
