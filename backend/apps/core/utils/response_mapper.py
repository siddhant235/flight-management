from rest_framework import status
from rest_framework.response import Response


def success_response(data=None, message="Request successful", code=status.HTTP_200_OK):
    return Response(
        {"status": "success", "message": message, "data": data}, status=code
    )


def error_response(
    message="An error occurred", code=status.HTTP_400_BAD_REQUEST, errors=None
):
    return Response(
        {"status": "error", "message": message, "errors": errors}, status=code
    )
