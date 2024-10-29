from django.contrib.auth.models import User
from users.models import Profile  # Замените `users` на имя вашего приложения
from faker import Faker
import random
from django.db.models.signals import post_save


# Инициализируем Faker для генерации случайных данных
fake = Faker()


def create_test_users_and_profiles(num_users=10):
    half = num_users // 2  # Половина для котонянь, половина для владельцев питомцев

    for i in range(num_users):
        # Генерация данных для пользователя
        username = fake.user_name()
        email = fake.email()
        password = 'testpassword'  # Один пароль для всех пользователей для упрощения тестирования
        first_name = fake.first_name()
        last_name = fake.last_name()

        # Создаем пользователя с заполненными данными
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name
        )

        # Определяем тип профиля (котоняня или владелец питомца)
        is_catnanny = i < half
        is_pet_owner = not is_catnanny

        # Создаем профиль с заполненными данными
        Profile.objects.create(
            user=user,
            phone_number=fake.phone_number()[:15],
            bio=fake.text(max_nb_chars=200),
            city=fake.city(),
            address=fake.address(),
            has_pets=random.choice([True, False]),
            has_children_under_10=random.choice([True, False]),
            pickup=random.choice([True, False]),
            visit=random.choice([True, False]),
            is_catnanny=is_catnanny,
            is_pet_owner=is_pet_owner
        )

        # Сообщение о создании пользователя и профиля
        print(f"Created {'catnanny' if is_catnanny else 'pet owner'} profile for user '{username}'")

# Запускаем функцию создания тестовых данных
create_test_users_and_profiles()

# Включаем сигнал обратно после создания пользователей и профилей
post_save.connect(create_profile, sender=User)
