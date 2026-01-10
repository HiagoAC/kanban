from django.test import TestCase, RequestFactory
from django.contrib.auth import get_user_model
from django.contrib.sessions.middleware import SessionMiddleware
from unittest.mock import patch

from user.auth import AuthHandler
from user.services import create_guest_user

User = get_user_model()


class AuthHandlerTests(TestCase):
    """Test cases for the AuthHandler authentication class."""

    def setUp(self):
        self.factory = RequestFactory()
        self.auth_handler = AuthHandler()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )

    def _add_session_to_request(self, request):
        """Helper method to add session to request."""
        middleware = SessionMiddleware(lambda r: None)
        middleware.process_request(request)
        request.session.save()

    @patch('user.auth.django_auth')
    def test_authenticate_returns_authenticated_user(self, mock_django_auth):
        """Test that authenticate returns user when django_auth succeeds."""
        request = self.factory.get('/')
        mock_django_auth.return_value = self.user

        res = self.auth_handler.authenticate(request)

        self.assertEqual(res, self.user)
        mock_django_auth.assert_called_once_with(request)

    @patch('user.auth.django_auth')
    @patch('user.auth.create_guest_user')
    def test_authenticate_creates_new_guest_when_no_auth(
            self, mock_create_guest, mock_django_auth):
        """
        Test that authenticate creates new guest user when no authentication.
        """
        request = self.factory.get('/')
        self._add_session_to_request(request)

        mock_django_auth.return_value = None
        guest_user = User.objects.create_user(
            username='guest_123',
            is_guest=True
        )
        mock_create_guest.return_value = guest_user
        res = self.auth_handler.authenticate(request)

        self.assertEqual(res, guest_user)
        self.assertEqual(request.session['guest_user_id'], guest_user.id)
        mock_django_auth.assert_called_once_with(request)
        mock_create_guest.assert_called_once()

    @patch('user.auth.django_auth')
    def test_authenticate_returns_existing_guest_from_session(
            self, mock_django_auth):
        """
        Test that authenticate returns existing guest user from session.
        """
        request = self.factory.get('/')
        self._add_session_to_request(request)

        guest_user = create_guest_user()
        request.session['guest_user_id'] = guest_user.id

        mock_django_auth.return_value = None

        result_user = self.auth_handler.authenticate(request)

        self.assertEqual(result_user, guest_user)
        self.assertTrue(result_user.is_guest)
        mock_django_auth.assert_called_once_with(request)

    @patch('user.auth.django_auth')
    @patch('user.auth.create_guest_user')
    def test_authenticate_creates_new_guest_when_session_user_not_found(
            self, mock_create_guest, mock_django_auth):
        """
        Test that authenticate creates new guest when session user doesn't
        exist.
        """
        request = self.factory.get('/')
        self._add_session_to_request(request)
        request.session['guest_user_id'] = 99999

        mock_django_auth.return_value = None
        new_guest_user = User.objects.create_user(
            username='guest_new',
            is_guest=True
        )
        mock_create_guest.return_value = new_guest_user
        result_user = self.auth_handler.authenticate(request)

        self.assertEqual(result_user, new_guest_user)
        self.assertEqual(request.session['guest_user_id'], new_guest_user.id)
        mock_create_guest.assert_called_once()

    @patch('user.auth.django_auth')
    @patch('user.auth.create_guest_user')
    def test_authenticate_creates_new_guest_when_session_user_not_guest(
            self, mock_create_guest, mock_django_auth):
        """
        Test that authenticate creates new guest when session user is not a
        guest.
        """
        request = self.factory.get('/')
        self._add_session_to_request(request)

        regular_user = User.objects.create_user(
            username='regular_user',
            is_guest=False
        )
        request.session['guest_user_id'] = regular_user.id

        mock_django_auth.return_value = None
        new_guest_user = User.objects.create_user(
            username='guest_new',
            is_guest=True
        )
        mock_create_guest.return_value = new_guest_user

        result_user = self.auth_handler.authenticate(request)

        self.assertEqual(result_user, new_guest_user)
        self.assertEqual(request.session['guest_user_id'], new_guest_user.id)
        mock_create_guest.assert_called_once()
