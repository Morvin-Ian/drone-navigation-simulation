from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import HealthFacilitiesView, DroneLocationsView, DronesViewSet

router = DefaultRouter()
router.register(r'drones', DronesViewSet, basename='drone')

urlpatterns = [
    path("facilities/", HealthFacilitiesView.as_view(), name='facilities'),
    path('', include(router.urls)),
]