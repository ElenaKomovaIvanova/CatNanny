from orders.models import OrderStatusModel

def create_initial_statuses():
    statuses = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled')
    ]
    for status_code, status_name in statuses:
        # Используем get_or_create, чтобы избежать дублирования записей
        OrderStatusModel.objects.get_or_create(status=status_code)

    print("Statuses created successfully.")

if __name__ == "__main__":
    create_initial_statuses()
