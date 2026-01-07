from django.test import Client, TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from social_django.models import UserSocialAuth
from user.pipeline import sync_user_details


User = get_user_model()
ME_URL = reverse('api:me')
LOGOUT_URL = reverse('api:logout')


class GetUserProfileTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@gmail.com'
        )
        self.client = Client()
        self.client.force_login(self.user)

    def test_get_user_profile_with_google_data(self):
        """Test getting user profile with Google social auth data."""
        social_auth = UserSocialAuth.objects.create(
            user=self.user,
            provider='google-oauth2',
            uid='123456789',
            extra_data={
                'name': 'John Doe',
                'given_name': 'John',
                'family_name': 'Doe',
                'picture': 'https://lh3.googleusercontent.com/test-avatar.jpg',
                'email': 'testuser@gmail.com'
            }
        )
        backend = type('Backend', (), {'name': 'google-oauth2'})()
        sync_user_details(
            backend=backend,
            user=self.user,
            response=social_auth.extra_data
        )
        self.user.refresh_from_db()
        res = self.client.get(ME_URL)

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.json(), {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'avatar_url': self.user.avatar_url,
        })


class LogoutTests(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@gmail.com'
        )
        self.client = Client()

    def test_logout_authenticated_user(self):
        """Test that authenticated user can logout successfully."""
        self.client.force_login(self.user)
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, 200)
        res = self.client.post(LOGOUT_URL)
        self.assertEqual(res.status_code, 204)
        res = self.client.get(ME_URL)
        self.assertEqual(res.status_code, 401)

    def test_logout_unauthenticated_user(self):
        """Test that unauthenticated user gets 401 when trying to logout."""
        res = self.client.post(LOGOUT_URL)
        self.assertEqual(res.status_code, 401)

    def test_logout_clears_session(self):
        """Test that logout properly clears the session."""
        self.client.force_login(self.user)

        self.assertIn('_auth_user_id', self.client.session)

        res = self.client.post(LOGOUT_URL)
        self.assertEqual(res.status_code, 204)
        self.assertNotIn('_auth_user_id', self.client.session)
