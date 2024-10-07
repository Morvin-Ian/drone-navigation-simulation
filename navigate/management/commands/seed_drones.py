import random
import uuid
from django.core.management.base import BaseCommand
from faker import Faker
from navigate.models import Drones
from django.contrib.gis.geos import Point

class Command(BaseCommand):
    help = 'Seed the Drones model with fake data within Kenya'

    def handle(self, *args, **kwargs):
        fake = Faker()

        # Kenya's latitude and longitude bounding box
        kenya_lat_min = -4.68
        kenya_lat_max = 5.02
        kenya_lon_min = 33.50
        kenya_lon_max = 41.89

        for _ in range(10):  
            lat = random.uniform(kenya_lat_min, kenya_lat_max)
            lon = random.uniform(kenya_lon_min, kenya_lon_max)

            drone = Drones.objects.create(
                uuid=uuid.uuid4(),
                name=fake.company(),
                serial_no=fake.unique.bothify(text='SN-#####'),
                geom=Point(lon, lat),  
                occupied=False,
                waypoints=None,
                drone_tracker=0,
                departure=None,  
                destination=None  
            )
            drone.save()

        self.stdout.write(self.style.SUCCESS('Drones table seeded successfully!'))
