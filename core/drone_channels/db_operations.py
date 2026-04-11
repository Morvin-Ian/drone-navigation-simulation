from channels.db import database_sync_to_async
from django.contrib.gis.geos import Point
from navigate.models import Drones
import logging

logger = logging.getLogger(__name__)

@database_sync_to_async
def update_drone_position(drone_id, lat, lng, drone_tracker):
    try:
        drone = Drones.objects.filter(uuid=drone_id).only('uuid', 'geom', 'drone_tracker').first()
        if drone and lat and lng and drone_tracker:
            new_position = Point(float(lng), float(lat))
            drone.geom = new_position
            drone.drone_tracker = drone_tracker
            drone.save(update_fields=['geom', 'drone_tracker'])
            return drone, lat, lng
    except ValueError as e:
        logger.error(f"Invalid lat/lng values: {e}")
    except Exception as e:
        logger.error(f"Error updating drone position: {e}")
    return None

@database_sync_to_async
def complete_route(drone_id):
    try:
        drone = Drones.objects.filter(uuid=drone_id).first()
        if drone:
            drone.waypoints = None
            drone.occupied = False
            drone.drone_tracker = 0
            drone.departure = None
            drone.destination = None
            drone.save(update_fields=['waypoints', 'occupied', 'drone_tracker', 'departure', 'destination'])
            return drone
    except Exception as e:
        logger.error(f"Error completing route: {e}")
    return None