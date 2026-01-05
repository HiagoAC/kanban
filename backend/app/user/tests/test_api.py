from django.test import Client, TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from social_django.models import UserSocialAuth
from user.pipeline import sync_user_details


User = get_user_model()
ME_URL = reverse('api:me')


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
