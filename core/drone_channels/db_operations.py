from channels.db import database_sync_to_async
from navigate.models import HealthFacilities


@database_sync_to_async
def save_message(message, sender, recepient, dialog, file=None):
    return None

@database_sync_to_async
def get_user(uuid):
    return None

