"""
Custom pagination classes.
"""
from rest_framework.pagination import PageNumberPagination


class StandardResultsSetPagination(PageNumberPagination):
    """Standard pagination for API responses."""
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class SmallResultsSetPagination(PageNumberPagination):
    """Smaller pagination for mobile or limited views."""
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
