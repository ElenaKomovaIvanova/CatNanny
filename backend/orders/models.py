from django.db import models
from django.contrib.auth.models import User
from users.models import Profile

class Orders(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests_made')
    catnanny = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='requests_received')

    CAT_GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]
    cat_name = models.CharField(max_length=100)
    cat_gender = models.CharField(max_length=1, choices=CAT_GENDER_CHOICES)
    cat_weight = models.DecimalField(max_digits=5, decimal_places=2)
    cat_age = models.IntegerField(help_text="Age of the cat in years")

    start_date = models.DateField()
    end_date = models.DateField()

    stay_type = models.CharField(
        max_length=20,
        choices=[('pickup', 'Pickup by Catnanny'), ('visit', 'Visit at Owner’s')],
        help_text="Indicates if the cat should be picked up or visited at owner's place."
    )

    message = models.TextField(max_length=1000, blank=True, help_text="Message from the owner to the catnanny")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Request from {self.owner.username} to {self.catnanny.user.username} for {self.cat_name}"

class OrderStatusModel(models.Model):
    STATUS_CHOICES = [
        ('new', 'New'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, unique=True)

    def __str__(self):
        return self.get_status_display()

    @staticmethod
    def get_next_statuses(current_status, order, user_role):
        """
        Determines available transitions for the current status based on the user's role.
        """
        if current_status == 'new':
            if user_role == 'owner':
                return ['new', 'cancelled']
            elif user_role == 'catnanny':
                return ['new', 'in_progress', 'cancelled']
        elif current_status == 'in_progress':
            if user_role == 'catnanny':
                return ['in_progress', 'completed']
            elif user_role == 'owner':
                return ['in_progress']
        elif current_status in ['completed', 'cancelled']:
            return [current_status]
        return []

class OrderStatusLog(models.Model):
    order = models.ForeignKey(Orders, on_delete=models.CASCADE, related_name='status_logs')
    status_order = models.ForeignKey(OrderStatusModel, on_delete=models.CASCADE)
    updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"Status '{self.status_order.status}' for Order {self.order.id} by {self.updated_by}"
