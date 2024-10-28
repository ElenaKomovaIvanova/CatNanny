from django.db import models
from django.contrib.auth.models import User

class Orders(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests_made')
    catnanny = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests_received')

    CAT_GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]

    cat_name = models.CharField(max_length=100)
    cat_gender = models.CharField(max_length=1, choices=CAT_GENDER_CHOICES)
    cat_weight = models.DecimalField(max_digits=5, decimal_places=2)  # Weight in kg with precision
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
        return f"Request from {self.owner.username} to {self.catnanny.username} for {self.cat_name}"