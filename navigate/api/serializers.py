from rest_framework_gis.serializers import GeoFeatureModelSerializer
from navigate.models import HealthFacilities


class HealthFacilitiesSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = HealthFacilities
        geo_field = 'geom'
        fields = ('name', 'healthcare', 'amenity', 'operatorty')