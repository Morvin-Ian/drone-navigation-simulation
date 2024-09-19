from channels.db import database_sync_to_async
from django.contrib.gis.geos import Point
from navigate.models import Drones


@database_sync_to_async
def update_drone_position( drone_id, lat, lng):
    drone = get_drone(drone_id)
    if drone and lat and lng:
        try:
            new_position = Point(float(lng), float(lat))
            drone.update_position(new_position)
            return drone
        except:
            return None


@database_sync_to_async
def get_drone(id):
    print(id)
    drone = Drones.objects.get(id=id)
    if drone:
        return drone
    else:
        return None

