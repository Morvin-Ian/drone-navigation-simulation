from rest_framework.generics import ListAPIView
from navigate.models import HealthFacilities, Drones
from .serializers import HealthFacilitiesSerializer, DroneLocationSerializer
from rest_framework import viewsets, status
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
        departure = request.data.get('departure', None)
        destination = request.data.get('destination', None)

        if waypoints:
            try:
                if departure and destination:
                    departure_point = Point(float(departure[0]), float(departure[1]))
                    destination_point = Point(float(destination[0]), float(destination[1]))
                    
                    drone.departure = departure_point
                    drone.destination = destination_point
                    
                drone.set_route(waypoints)
                drone.save()
                
                return Response({'status': 'route set'})
            except (ValueError, KeyError):
                return Response({'status': 'error', 'message': 'Invalid coordinates'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status': 'error', 'message': 'Waypoints, departure, and destination are required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def update_position(self, request, pk=None):
        drone = self.get_object()
        lat = request.data.get('lat')
        lng = request.data.get('lng')
        drone_tracker = request.data.get('drone_tracker')
        if lat and lng and drone_tracker:
            try:
                new_position = Point(float(lng), float(lat))
                drone.update_position(new_position, drone_tracker)
                return Response({'status': 'position updated'}, status = status.HTTP_200_OK)
            except ValueError:
                return Response({'status': 'error', 'message': 'Invalid coordinates'}, status=status.HTTP_400_BAD_REQUEST)
        return Response({'status': 'error', 'message': 'Drone tracker, Latitude and longitude are required'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def complete_route(self, request, pk=None):
        drone = self.get_object()
        drone.complete_route()
        drone.departure = None
        drone.destination = None
        drone.save()
        return Response({'status': 'route completed'})