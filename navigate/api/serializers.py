from rest_framework_gis.serializers import GeoFeatureModelSerializer
from navigate.models import HealthFacilities, Drones


class HealthFacilitiesSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = HealthFacilities
        geo_field = 'geom'
        fields = ('name', 'healthcare', 'amenity', 'operatorty')
        

class DroneLocationSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Drones
        geo_field = 'geom'
        fields =('uuid', 'name', 'serial_no', 'battery_capacity', 'current_charge', 'waypoints', 'occupied')
        read_only_fields = ('uuid', 'name', 'serial_no', 'battery_capacity', 'current_charge')