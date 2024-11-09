# Generated by Django 5.1.2 on 2024-11-03 10:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('orders', '0002_orderstatusmodel_alter_orders_catnanny_and_more'),
        ('users', '__first__'),
    ]

    operations = [
        migrations.CreateModel(
            name='Visit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('catnanny', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visits', to='users.profile')),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='visits', to='orders.orders')),
            ],
        ),
    ]