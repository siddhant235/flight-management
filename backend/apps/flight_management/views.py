from rest_framework import status, viewsets
from rest_framework.decorators import action

from apps.core.utils.response_mapper import error_response, success_response
from apps.flight_management.models import Flight


class FlightManagementViewSet(viewsets.ViewSet):
    @action(detail=False, methods=["get"], url_path="get-all-flights")
    def get(self, request):
        try:
            flights = Flight.objects.all().values()
            return success_response(
                data=list(flights),
                message="Request successful",
                code=status.HTTP_200_OK,
            )
        except Exception as e:
            return error_response(
                message=str(e), code=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
