from django.test import TestCase
from django.contrib.auth import get_user_model

from user.pipeline import create_user_with_board_pipeline

User = get_user_model()


class CreateUserWithBoardPipelineTests(TestCase):
    def test_create_user_with_board_pipeline_new_user(self):
        """Test creating a new user with default board via pipeline."""
        username = 'testuser'
        details = {'username': username}
        result = create_user_with_board_pipeline(
            strategy=None,
            details=details,
            backend=None,
            user=None
        )
        self.assertTrue(result['is_new'])
        self.assertIsInstance(result['user'], User)
        self.assertEqual(result['user'].username, username)

    def test_create_user_with_board_pipeline_new_user_with_email(self):
        """
        Test creating a new user with default board via pipeline with email.
        """
        email = 'testuser@example.com'
        details = {'email': email}
        result = create_user_with_board_pipeline(
            strategy=None,
            details=details,
            backend=None,
            user=None
        )
        self.assertTrue(result['is_new'])
        self.assertIsInstance(result['user'], User)
        self.assertEqual(result['user'].username, email)

    def test_create_user_with_board_pipeline_existing_user(self):
        """Test pipeline with an existing user."""
        username = 'existinguser'
        existing_user = User.objects.create_user(username=username)
        details = {'username': username}
        result = create_user_with_board_pipeline(
            strategy=None,
            details=details,
            backend=None,
            user=existing_user
        )
        self.assertFalse(result['is_new'])
        self.assertEqual(result['user'], existing_user)

    def test_create_user_with_board_pipeline_no_username(self):
        """Test pipeline when no username or email is provided."""
        details = {}
        result = create_user_with_board_pipeline(
            strategy=None,
            details=details,
            backend=None,
            user=None
        )
        self.assertIsNone(result)
