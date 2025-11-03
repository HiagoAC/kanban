import json

from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import reverse

from board.models import Board, Column
from card.models import Card


User = get_user_model()
CARDS_URL = reverse('api:cards')


class PublicCardsApiTests(TestCase):
    """Test unauthenticated requests to the cards API."""

    def setUp(self):
        self.client = Client()

    def test_auth_required(self):
        """Test that authentication is required to access the card API"""
        res = self.client.get(CARDS_URL)
        self.assertEqual(res.status_code, 401)


class PrivateCardsApiTests(TestCase):
    """Test authenticated requests to the cards API."""

    def setUp(self):
        self.user = User.objects.create_user('testuser@example.com')
        self.client = Client()
        self.client.force_login(self.user)

        self.board = Board.objects.create(title='Test Board', user=self.user)
        self.column = Column.objects.create(board=self.board, title='To Do')
        self.another_column = Column.objects.create(board=self.board, title='Done')

    def test_list_cards(self):
        """Test retrieving a list of cards."""
        card1 = Card.objects.create(title='Card 1', column=self.column)
        card2 = Card.objects.create(title='Card 2', column=self.column)
        Card.objects.create(title='Card 3', column=self.another_column)
        res = self.client.get(CARDS_URL)
        content = json.loads(res.content.decode('utf-8'))
        self.assertEqual(res.status_code, 200)
        expected = [
            {'id': c.id, 'title': c.title, 'priority': c.priority}
            for c in (card1, card2)
        ]
        self.assertEqual(content, expected)

    def test_filter_cards_by_column(self):
        """Test filtering cards by column."""
        card1 = Card.objects.create(title='Card 1', column=self.column)
        card2 = Card.objects.create(title='Card 2', column=self.column)
        Card.objects.create(title='Card 3', column=self.another_column)
        res = self.client.get(CARDS_URL, {'column': self.column.id})
        content = json.loads(res.content.decode('utf-8'))
        self.assertEqual(res.status_code, 200)
        expected = [
            {'id': c.id, 'title': c.title, 'priority': c.priority.value}
            for c in (card1, card2)
        ]
        self.assertEqual(content, expected)
