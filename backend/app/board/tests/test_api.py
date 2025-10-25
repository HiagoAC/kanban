import json

from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import reverse

from board.models import Board, Column

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

    def test_create_board(self):
        """Test creating a new board with columns."""
        payload = {
            'title': 'New Board',
            'columns': ['To Do', 'In Progress', 'Done']
        }
        res = self.client.post(
            BOARD_URL,
            data=json.dumps(payload),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 201)
        board = Board.objects.get(user=self.user, title=payload['title'])
        created_columns = set(
            Column.objects.filter(board=board).values_list('title', flat=True)
        )
        self.assertEqual(created_columns, set(payload['columns']))

    def test_create_board_duplicate_title(self):
        """Test creating a board with a duplicate title fails."""
        Board.objects.create(user=self.user, title='Duplicate Title')
        payload = {'title': 'Duplicate Title', 'columns': ['To Do']}
        res = self.client.post(
            BOARD_URL,
            data=json.dumps(payload),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 400)
