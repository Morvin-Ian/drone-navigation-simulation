from django.db import models
from django.contrib.gis.db import models as gis_models


class HealthFacilities(models.Model):
    name    = models.CharField(max_length=80, null=True, blank=True)
    healthcare = models.CharField(max_length=167, null=True, blank=True)
    amenity = models.CharField(max_length=80, null=True, blank=True)
    operatorty = models.CharField(max_length=80, null=True, blank=True)
    geom = gis_models.PointField(srid=4326)
    
    class Meta:
        verbose_name_plural = "Health Facilities"

    def __str__(self) -> str:
        return self.name if self.name else "Unnamed Facility"
    

class Drones(models.Model):
    name = models.CharField(max_length=80)
    serial_no = models.CharField(max_length=80)
    battery_capacity = models.IntegerField(default=100)
    current_charge = models.IntegerField(default=100)
    geom = gis_models.PointField(srid=4326)
    
    class Meta:
        verbose_name_plural = "Drones"
    
    def __str__(self) -> str:
        return self.name
    
    
