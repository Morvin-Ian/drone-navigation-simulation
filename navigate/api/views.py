from rest_framework.generics import ListAPIView
from navigate.models import HealthFacilities, Drones
from .serializers import HealthFacilitiesSerializer, DroneLocationSerializer


class HealthFacilitiesView(ListAPIView):
    queryset = HealthFacilities.objects.all()
    serializer_class = HealthFacilitiesSerializer
    
class DroneLocationsView(ListAPIView):
    queryset = Drones.objects.all()
    serializer_class = DroneLocationSerializer