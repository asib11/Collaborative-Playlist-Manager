"""
Custom exception handling for the API.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides consistent error responses.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Customize the response format
        custom_response_data = {
            'error': {
                'message': str(exc),
                'details': response.data
            }
        }
        
        # Add error code if available
        if hasattr(exc, 'default_code'):
            custom_response_data['error']['code'] = exc.default_code.upper()
        
        response.data = custom_response_data
        logger.warning(f"API Error: {exc} - Context: {context}")
    else:
        # Handle non-DRF exceptions
        logger.error(f"Unhandled exception: {exc}", exc_info=True)
        response = Response(
            {
                'error': {
                    'code': 'INTERNAL_ERROR',
                    'message': 'An unexpected error occurred',
                    'details': str(exc)
                }
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    return response


class DuplicateTrackError(Exception):
    """Raised when attempting to add a duplicate track to playlist."""
    pass


class InvalidPositionError(Exception):
    """Raised when position calculation fails."""
    pass
