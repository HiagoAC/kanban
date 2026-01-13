from django.test import Client, TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from social_django.models import UserSocialAuth
from user.pipeline import sync_user_details


User = get_user_model()
ME_URL = reverse('api:me')
LOGOUT_URL = reverse('api:logout')
SET_GUEST_ACTION_URL = reverse('api:set_guest_action')


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
            'is_guest': self.user.is_guest,
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
        content = res.json()
        self.assertEqual(content['id'], self.user.id)

        res = self.client.post(LOGOUT_URL)
        self.assertEqual(res.status_code, 204)

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


class SetGuestActionTests(TestCase):

    def setUp(self):
        self.client = Client()

    def test_set_guest_action_merge(self):
        """Test setting guest action to 'merge' in session."""
        data = {'guest_action': 'merge'}
        res = self.client.post(
            SET_GUEST_ACTION_URL,
            data=data,
            content_type='application/json'
        )

        self.assertEqual(res.status_code, 204)
        self.assertEqual(
            self.client.session['guest_migration_action'], 'merge')

    def test_set_guest_action_discard(self):
        """Test setting guest action to 'discard' in session."""
        data = {'guest_action': 'discard'}
        res = self.client.post(
            SET_GUEST_ACTION_URL,
            data=data,
            content_type='application/json'
        )

        self.assertEqual(res.status_code, 204)
        self.assertEqual(
            self.client.session['guest_migration_action'], 'discard')

    def test_set_guest_action_invalid_value(self):
        """Test setting guest action with invalid value returns 422."""
        data = {'guest_action': 'invalid'}
        res = self.client.post(
            SET_GUEST_ACTION_URL,
            data=data,
            content_type='application/json'
        )

        self.assertEqual(res.status_code, 422)
        self.assertNotIn('guest_migration_action', self.client.session)

    def test_set_guest_action_missing_field(self):
        """Test setting guest action with missing field returns 422."""
        data = {}
        res = self.client.post(
            SET_GUEST_ACTION_URL,
            data=data,
            content_type='application/json'
        )

        self.assertEqual(res.status_code, 422)
        self.assertNotIn('guest_migration_action', self.client.session)

    def test_set_guest_action_overwrites_existing(self):
        """Test that setting guest action overwrites existing session value."""
        data = {'guest_action': 'merge'}
        res = self.client.post(
            SET_GUEST_ACTION_URL,
            data=data,
            content_type='application/json'
        )
        self.assertEqual(res.status_code, 204)
        self.assertEqual(
            self.client.session['guest_migration_action'], 'merge')

        data = {'guest_action': 'discard'}
        res = self.client.post(
            SET_GUEST_ACTION_URL,
            data=data,
            content_type='application/json'
        )
        self.assertEqual(res.status_code, 204)
        self.assertEqual(
            self.client.session['guest_migration_action'], 'discard')
