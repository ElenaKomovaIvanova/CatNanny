# utils.py
from rest_framework.response import Response
from rest_framework import status

def error_response(error: str, details: str = "", error_code: str = "ERROR", status_code: int = status.HTTP_400_BAD_REQUEST):
    return Response({
        "error": error,
        "details": details,
        "error_code": error_code,
        "status_code": status_code
    }, status=status_code)
