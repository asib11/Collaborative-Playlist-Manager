from django.db import models


class Track(models.Model):
    GENRE_CHOICES = [
        ('rock', 'Rock'),
        ('pop', 'Pop'),
        ('electronic', 'Electronic'),
        ('jazz', 'Jazz'),
        ('classical', 'Classical'),
        ('hip-hop', 'Hip-Hop'),
        ('indie', 'Indie'),
        ('alternative', 'Alternative'),
    ]
    
    title = models.CharField(max_length=200)
    artist = models.CharField(max_length=200)
    album = models.CharField(max_length=200)
    duration_seconds = models.IntegerField()
    genre = models.CharField(max_length=50, choices=GENRE_CHOICES)
    cover_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['artist', 'title']
        indexes = [
            models.Index(fields=['genre']),
            models.Index(fields=['artist']),
        ]
    
    def __str__(self):
        return f"{self.title} - {self.artist}"
    
    @property
    def duration_formatted(self):
        minutes = self.duration_seconds // 60
        seconds = self.duration_seconds % 60
        return f"{minutes}:{seconds:02d}"
