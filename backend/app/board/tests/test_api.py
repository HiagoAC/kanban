import json

from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import reverse

from board.models import Board

User = get_user_model()
BOARD_URL = reverse('api:boards')


class PublicBoardsApiTests(TestCase):
    """Test unauthenticated requests to the boards API."""

    def setUp(self):
        self.client = Client()

    def test_auth_required(self):
        """Test that authentication is required to access the board API"""
        res = self.client.get(BOARD_URL)
        self.assertEqual(res.status_code, 401)


class PrivateBoardsApiTests(TestCase):
    """Test authenticated requests to the boards API."""

    def setUp(self):
        self.user = User.objects.create_user('testuser@example.com')
        self.client = Client()
        self.client.force_login(self.user)

    def test_retrieve_boards(self):
        """Test retrieving a list of boards."""
        board1 = Board.objects.create(title='b1', user=self.user)
        board2 = Board.objects.create(title='b2', user=self.user)
        another_user = User.objects.create_user('anotheruser@example.com')
        Board.objects.create(title='b3', user=another_user)
        res = self.client.get(BOARD_URL)
        content = json.loads(res.content.decode('utf-8'))
        self.assertEqual(res.status_code, 200)
        expected = [
            {'id': b.id, 'title': b.title}
            for b in (board1, board2)
        ]
        self.assertEqual(content, expected)
