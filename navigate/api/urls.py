from django.urls import path
from .views import HealthFacilitiesView, DroneLocationsView

urlpatterns = [
    path("facilities/", HealthFacilitiesView.as_view(), name='facilities'),
    path("drones/", DroneLocationsView.as_view(), name='drones')

]