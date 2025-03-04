from rest_framework.response import Response
from rest_framework.views import APIView

from apps.status_check.models import StatusCheckLog


class StatusCheckView(APIView):
    def get(self, request):
        log = StatusCheckLog.objects.create()

        return Response(
            status=200,
            data={
                "log_id": log.id,
            },
        )
