"""
Tests for position calculation service.
"""
import pytest
from apps.playlist.services import calculate_position


class TestPositionCalculation:
    """Test cases for the position calculation algorithm."""
    
    def test_calculate_first_position(self):
        """Test calculating position for first track."""
        result = calculate_position(None, None)
        assert result == 1.0
    
    def test_calculate_position_before_first(self):
        """Test inserting before the first track."""
        result = calculate_position(None, 1.0)
        assert result == 0.0
    
    def test_calculate_position_at_end(self):
        """Test appending to the end."""
        result = calculate_position(2.0, None)
        assert result == 3.0
    
    def test_calculate_middle_position(self):
        """Test inserting between two tracks."""
        result = calculate_position(1.0, 2.0)
        assert result == 1.5
    
    def test_calculate_nested_middle_position(self):
        """Test inserting between closely positioned tracks."""
        result = calculate_position(1.0, 1.5)
        assert result == 1.25
    
    def test_negative_position_raises_error(self):
        """Test that negative positions raise ValueError."""
        with pytest.raises(ValueError):
            calculate_position(-1.0, 2.0)
    
    def test_invalid_order_raises_error(self):
        """Test that prev >= next raises ValueError."""
        with pytest.raises(ValueError):
            calculate_position(2.0, 1.0)
