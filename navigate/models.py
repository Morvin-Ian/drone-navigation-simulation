from django.db import models
from django.contrib.gis.db import models as gis_models
import uuid


class HealthFacilities(models.Model):
    name = models.CharField(max_length=80, null=True, blank=True)
    healthcare = models.CharField(max_length=167, null=True, blank=True)
    amenity = models.CharField(max_length=80, null=True, blank=True)
    operatorty = models.CharField(max_length=80, null=True, blank=True)
    geom = gis_models.PointField(srid=4326)
    
    class Meta:
        verbose_name_plural = "Health Facilities"

    def __str__(self) -> str:
        return self.name if self.name else "Unnamed Facility"
    

class Drones(models.Model):
    uuid = models.UUIDField(primary_key=True, default = uuid.uuid4, editable=False)
    name = models.CharField(max_length=80)
    serial_no = models.CharField(max_length=80)
    battery_capacity = models.IntegerField(default=100)
    current_charge = models.IntegerField(default=100)
    geom = gis_models.PointField(srid=4326)
    occupied = models.BooleanField(default=False)
    waypoints = models.TextField(blank=True, null=True)
    
    class Meta:
        verbose_name_plural = "Drones"
    
    def __str__(self) -> str:
        return self.name
    
    def set_route(self, waypoints):
        self.waypoints = waypoints
        self.occupied = True
        self.save()

    def update_position(self, new_position):
        self.geom = new_position
        self.save()

    def complete_route(self):
        self.waypoints = None
        self.occupied = False
        self.save()
    
