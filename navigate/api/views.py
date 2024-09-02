from rest_framework.generics import ListAPIView
from navigate.models import HealthFacilities
from .serializers import HealthFacilitiesSerializer


class HealthFacilitiesView(ListAPIView):
    queryset = HealthFacilities.objects.all()
    serializer_class = HealthFacilitiesSerializer