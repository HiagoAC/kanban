import json

from django.contrib.auth import get_user_model
from django.test import Client, TestCase
from django.urls import reverse

from board.models import Board, Column

User = get_user_model()
BOARD_URL = reverse('api:boards')


def board_detail_url(board_id: int) -> str:
    """Return the detail URL for a board."""
    return reverse('api:board-detail', args=[board_id])


def column_url(board_id: int) -> str:
    return reverse('api:columns', args=[board_id])


def column_detail_url(board_id: int, column_id: int) -> str:
    return reverse('api:column-detail', args=[board_id, column_id])


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

    def test_retrieve_board(self):
        """Test retrieving a board."""
        board = Board.objects.create(user=self.user, title='A Board')
        Column.objects.create(board=board, title='To Do')
        Column.objects.create(board=board, title='Done')
        url = board_detail_url(board.id)
        res = self.client.get(url)
        self.assertEqual(res.status_code, 200)
        content = json.loads(res.content.decode('utf-8'))
        self.assertEqual(content['id'], board.id)
        self.assertEqual(content['title'], board.title)
        column_titles = {col['title'] for col in content['columns']}
        self.assertEqual(column_titles, {'To Do', 'Done'})

    def test_update_board(self):
        """Test updating a board."""
        board = Board.objects.create(user=self.user, title='A Board')
        url = board_detail_url(board.id)
        payload = {'title': 'Updated Board'}
        res = self.client.patch(
            url,
            data=json.dumps(payload),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)
        board.refresh_from_db()
        self.assertEqual(board.title, payload['title'])

    def test_delete_board(self):
        """Test deleting a board."""
        board = Board.objects.create(user=self.user, title='A Board')
        url = board_detail_url(board.id)
        res = self.client.delete(url)
        self.assertEqual(res.status_code, 204)
        exists = Board.objects.filter(id=board.id).exists()
        self.assertFalse(exists)

    def test_add_column_to_board(self):
        """Test adding a column to an existing board."""
        board = Board.objects.create(user=self.user, title='A Board')
        col1 = Column.objects.create(board=board, title='To Do')
        col2 = Column.objects.create(board=board, title='In Progress')
        payload = {
            'title': 'Done'
        }
        res = self.client.post(
            column_url(board.id),
            data=json.dumps(payload),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)
        all_columns = Column.objects.filter(board=board)
        self.assertEqual(
            list(all_columns.values_list('title', flat=True)),
            [col1.title, col2.title, payload['title']]
        )

    def test_delete_column_from_board(self):
        """Test deleting a column from a board."""
        board = Board.objects.create(user=self.user, title='A Board')
        col1 = Column.objects.create(board=board, title='To Do')
        col2 = Column.objects.create(board=board, title='In Progress')
        col3 = Column.objects.create(board=board, title='Done')

        res = self.client.delete(
            column_detail_url(board.id, col2.id)
        )
        self.assertEqual(res.status_code, 204)

        remaining_columns = Column.objects.filter(board=board)
        self.assertEqual(list(remaining_columns), [col1, col3])

    def test_update_column_from_board(self):
        """Test updating a column from a board."""
        board = Board.objects.create(user=self.user, title='A Board')
        column = Column.objects.create(board=board, title='To Do')

        payload = {
            'title': 'Updated To Do'
        }
        url = column_detail_url(board.id, column.id)
        res = self.client.patch(
            url,
            data=json.dumps(payload),
            content_type='application/json',
        )
        self.assertEqual(res.status_code, 200)

        column.refresh_from_db()
        self.assertEqual(column.title, payload['title'])
