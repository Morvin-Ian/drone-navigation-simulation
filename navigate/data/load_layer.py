import os
from django.contrib.gis.utils import LayerMapping
from navigate.models import HealthFacilities

facilities = os.path.abspath(os.path.join(os.path.dirname(__file__), 'health_facilities.gpkg'))

healthfacilities_mapping = {
    'name': 'name',
    'healthcare': 'healthcare',
    'amenity': 'amenity',
    'operatorty': 'operatorty',
    'geom': 'POINT',
}

def run(verbose=True):
    lm = LayerMapping(HealthFacilities, facilities, healthfacilities_mapping, transform=False, encoding='iso-8859-1')
    lm.save(strict=True, verbose=verbose)

    