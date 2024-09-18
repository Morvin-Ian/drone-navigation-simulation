from rest_framework.generics import ListAPIView
from navigate.models import HealthFacilities, Drones
from .serializers import HealthFacilitiesSerializer, DroneLocationSerializer
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.gis.geos import Point

class HealthFacilitiesView(ListAPIView):
    queryset = HealthFacilities.objects.all()
    serializer_class = HealthFacilitiesSerializer
    
class DroneLocationsView(ListAPIView):
    queryset = Drones.objects.all()
    serializer_class = DroneLocationSerializer


class DronesViewSet(viewsets.ModelViewSet):
    queryset = Drones.objects.all()
    serializer_class = DroneLocationSerializer

    @action(detail=True, methods=['post'])
    def set_route(self, request, pk=None):
        drone = self.get_object()
        waypoints = request.data.get('waypoints')
        if waypoints:
            drone.set_route(waypoints)
            return Response({'status': 'route set'})
        return Response({'status': 'error', 'message': 'No waypoints provided'}, status=400)

    @action(detail=True, methods=['post'])
    def update_position(self, request, pk=None):
        drone = self.get_object()
        lat = request.data.get('lat')
        lng = request.data.get('lng')
        if lat and lng:
            new_position = Point(float(lng), float(lat))
            drone.update_position(new_position)
            return Response({'status': 'position updated'})
        return Response({'status': 'error', 'message': 'Invalid coordinates'}, status=400)

    @action(detail=True, methods=['post'])
    def complete_route(self, request, pk=None):
        drone = self.get_object()
        drone.complete_route()
        return Response({'status': 'route completed'})