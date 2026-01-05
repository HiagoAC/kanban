from django.test import TestCase
from django.contrib.auth import get_user_model

User = get_user_model()


class UserModelTest(TestCase):
    """Test cases for the custom User model."""

    def test_user_creation(self):
        """Test creating a user with basic fields."""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpass123'))
        self.assertIsNone(user.avatar_url)

    def test_user_creation_with_avatar_url(self):
        """Test creating a user with avatar_url."""
        avatar_url = 'https://example.com/avatar.jpg'
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123',
            avatar_url=avatar_url
        )
        self.assertEqual(user.avatar_url, avatar_url)

    def test_user_str_representation(self):
        """Test the string representation of a user."""
        user = User.objects.create_user(
            username='testuser',
            password='testpass123'
        )
        self.assertEqual(str(user), 'testuser')
