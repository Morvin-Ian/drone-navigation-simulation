from django.urls import path
from .views import HealthFacilitiesView

urlpatterns = [
    path("facilities/", HealthFacilitiesView.as_view(), name='facilities')
]