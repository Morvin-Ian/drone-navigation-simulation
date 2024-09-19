from channels.db import database_sync_to_async


@database_sync_to_async
def update_drone_position( lat, lng):
    return None

@database_sync_to_async
def get_drone(name):
    return None

