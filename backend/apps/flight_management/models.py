from django.db import models

from apps.core.models import BaseModel


class Flight(BaseModel):
    flight_number = models.CharField(
        max_length=100, unique=True, help_text="Flight number"
    )
    departure_airport = models.CharField(max_length=100, help_text="Departure airport")
    arrival_airport = models.CharField(max_length=100, help_text="Arrival airport")
    departure_time = models.DateTimeField(help_text="Departure time")
    arrival_time = models.DateTimeField(help_text="Arrival time")

    def __str__(self):
        return (
            f"{self.flight_number} ({self.departure_airport} -> {self.arrival_airport})"
        )

    class Meta:
        app_label = "flight_management"
