# permissions.py
from rest_framework.permissions import BasePermission, SAFE_METHODS

class IsAuthenticatedOrReadOnlyForSpecificProfile(BasePermission):
    def has_permission(self, request, view):
        # Разрешаем доступ всем пользователям, если указан id и это GET-запрос
        if 'id' in view.kwargs and request.method in SAFE_METHODS:
            return True
        # В остальных случаях требуем авторизацию
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        # Проверка: если пользователь аутентифицирован, разрешаем доступ к его профилю
        if request.user.is_authenticated:
            return obj.user == request.user
        # Разрешаем доступ к профилю по id для неавторизованных пользователей
        return True
