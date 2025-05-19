"""
- This gives us access to the project's settings module at runtime.
- We use it here so that if we ever swap in a custom user model 
  (via AUTH_USER_MODEL), the `Profile` will follow along automatically
"""
from django.conf import settings

# The base module for all Django model fields and the `Model` class itself.
from django.db import models

# Create your models here.

"""
- By subclassing models.Model, we tell Django "this is a table I want you 
  to create in the database."
- Django will assign this table the name `<app_label>_profile` (in our case, users_profile),
  and automatically add a primary-key column named `id`
"""
class Profile(models.Model):

    """
    - Creates a one-to-one relationship between Profile and whatever model
      we've designated as the user (by default, auth.User).
    - Under the hood, this is a foreign-key column (user_id) with a
      UNIQUE constraint, so each `Profile` points to exactly one `User`,
      and each User can have at most one `Profile`
    """
    user = models.OneToOneField(

        # Reads the `AUTH_USER_MODEL` setting (usually "auth.User", but you might override it)
        # Using the setting instead of importing `django.contrib.auth.models.User`
          # directly keeps your code flexible
        settings.AUTH_USER_MODEL,

        # If the referenced `User` is deleted, Django will automatically delete the associated `Profile`
        # This prevents "orphan" profiles in the database.
        on_delete=models.CASCADE,

        # Sets up the reverse relation: given a `User` instance `u`, you can write
          # `u.profile` to fetch their `Profile`
        # Without `related_name`, Django would default to `user.profile_set`, which is less intuitive
        related_name='profile'
    )

    """
    TextField:
    - A large-capacity text column (equivalent to SQL `TEXT`), suitable for multi-paragraph bios
    blank=True:
    - Allows this field to be empty in forms and the admin UI.
    - Note: `blank=True` affects validation; if you wanted to allow `NULL` in the database you'd also
      add `null=True`, but here an empty string ("") suffices.
    """
    bio = models.TextField(blank=True)

    """
    - This defines the "human-readable" representation of each `Profile` instance
    - It makes both the Django admin and any debug output more meaningful.
    """
    def __str__(self):
        return f"{self.user.username}'s profile"
    """
    >>> p = Profile.objects.first()
    >>> print(p)
    alice's profile
    """