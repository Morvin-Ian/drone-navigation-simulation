from channels.db import database_sync_to_async
from django.contrib.gis.geos import Point
from navigate.models import Drones


@database_sync_to_async
def update_drone_position(drone_id, lat, lng, drone_tracker):
    drone = get_drone(drone_id)
    if (drone and lat and lng and drone_tracker):
        try:
            new_position = Point(float(lng), float(lat))
            drone.update_position(new_position, drone_tracker)
            return drone
        except:
            return None

@database_sync_to_async
def complete_route(drone_id):
    drone = get_drone(drone_id)
    if drone:
        try:
            drone.complete_route()
            return drone
        except:
            return None
    

@database_sync_to_async
def get_drone(id):
    drone = Drones.objects.get(id=id)
    if drone:
        return drone
    else:
        return None

