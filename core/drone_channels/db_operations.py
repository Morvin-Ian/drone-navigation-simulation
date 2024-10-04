from channels.db import database_sync_to_async
from django.contrib.gis.geos import Point
from navigate.models import Drones
import logging

logger = logging.getLogger(__name__)

@database_sync_to_async
def update_drone_position(drone_id, lat, lng, drone_tracker):
    try:
        drone = Drones.objects.get(uuid=drone_id)
        if drone and lat and lng and drone_tracker:
            new_position = Point(float(lng), float(lat))
            drone.update_position(new_position, drone_tracker)
            return drone, lat, lng
    except ValueError as e:
        logger.error(f"Invalid lat/lng values: {e}")
    except Exception as e:
        logger.error(f"Error updating drone position: {e}")
    return None

@database_sync_to_async
def complete_route(drone_id):
    try:
        drone = Drones.objects.get(uuid=drone_id)
        if drone:
            drone.complete_route()
            return drone
    except Exception as e:
        logger.error(f"Error completing route: {e}")
    return None