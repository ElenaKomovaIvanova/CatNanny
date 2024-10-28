# Generated by Django 5.1.2 on 2024-10-27 09:38

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_profile_is_catnanny_profile_is_pet_owner'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='review',
            name='request',
        ),
        migrations.AlterUniqueTogether(
            name='review',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='review',
            name='catnanny',
        ),
        migrations.RemoveField(
            model_name='review',
            name='reviewer',
        ),
        migrations.AlterUniqueTogether(
            name='unavailabledate',
            unique_together=None,
        ),
        migrations.RemoveField(
            model_name='unavailabledate',
            name='user',
        ),
        migrations.DeleteModel(
            name='Request',
        ),
        migrations.DeleteModel(
            name='Review',
        ),
        migrations.DeleteModel(
            name='UnavailableDate',
        ),
    ]
