from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from navigate.models import HealthFacilities, Drones


@admin.register(HealthFacilities)
class HealthFacilitiesAdmin(LeafletGeoAdmin):
    list_display = ('name', 'healthcare', 'geom')
    
admin.site.register(Drones)
class DronesAdmin(LeafletGeoAdmin):
    list_display = ('name', 'serial_no', 'geom')