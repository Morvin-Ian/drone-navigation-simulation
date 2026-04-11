from django.db import models
from django.contrib.gis.db import models as gis_models
import uuid


class HealthFacilities(models.Model):
    name = models.CharField(max_length=80, null=True, blank=True, db_index=True)
    healthcare = models.CharField(max_length=167, null=True, blank=True, db_index=True)
    amenity = models.CharField(max_length=80, null=True, blank=True, db_index=True)
    operatorty = models.CharField(max_length=80, null=True, blank=True)
    geom = gis_models.PointField(srid=4326, spatial_index=True)
    
    class Meta:
        verbose_name_plural = "Health Facilities"
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['healthcare']),
            models.Index(fields=['amenity']),
        ]

    def __str__(self) -> str:
        return self.name if self.name else "Unnamed Facility"
    

class Drones(models.Model):
    uuid = models.UUIDField(primary_key=True, default = uuid.uuid4, editable=False)
    name = models.CharField(max_length=80, db_index=True)
    serial_no = models.CharField(max_length=80, db_index=True)
    geom = gis_models.PointField(srid=4326, spatial_index=True)
    occupied = models.BooleanField(default=False, db_index=True)
    waypoints = models.TextField(blank=True, null=True)
    drone_tracker = models.IntegerField(blank=True, null=True)
    departure = gis_models.PointField(srid=4326, blank=True, null=True)
    destination = gis_models.PointField(srid=4326, blank=True, null=True)
    
    class Meta:
        verbose_name_plural = "Drones"
        indexes = [
            models.Index(fields=['occupied']),
            models.Index(fields=['name']),
        ]
    
    def __str__(self) -> str:
        return self.name
    
    def set_route(self, waypoints):
        self.waypoints = waypoints
        self.occupied = True
        self.save()

    def update_position(self, new_position, drone_tacker):
        self.geom = new_position
        self.drone_tracker = drone_tacker
        self.save()

    def complete_route(self):
        self.waypoints = None
        self.occupied = False
        self.drone_tracker = 0
        self.save()
    
