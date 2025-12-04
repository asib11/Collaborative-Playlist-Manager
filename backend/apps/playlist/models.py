from django.db import models
from django.core.exceptions import ValidationError
from apps.tracks.models import Track


class PlaylistTrack(models.Model):    
    track = models.ForeignKey(Track, on_delete=models.CASCADE, related_name='playlist_items')
    position = models.FloatField(default=1.0, db_index=True)
    votes = models.IntegerField(default=0)
    added_by = models.CharField(max_length=100, default="Anonymous")
    added_at = models.DateTimeField(auto_now_add=True)
    is_playing = models.BooleanField(default=False, db_index=True)
    played_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        ordering = ['position']
        indexes = [
            models.Index(fields=['position']),
            models.Index(fields=['is_playing']),
            models.Index(fields=['-votes']),
        ]
    
    def clean(self):
        if self.pk is None:  # Only check on creation
            if PlaylistTrack.objects.filter(track=self.track).exists():
                raise ValidationError({
                    'track': 'This track is already in the playlist'
                })
    
    def save(self, *args, **kwargs):
        if self.pk is None:  # Only on creation
            self.full_clean()
        super().save(*args, **kwargs)
    
    def set_as_playing(self):
        from django.utils import timezone
        
        # Set all other tracks to not playing
        PlaylistTrack.objects.exclude(pk=self.pk).update(is_playing=False)
        
        # Set this track as playing
        self.is_playing = True
        self.played_at = timezone.now()
        self.save()
    
    def __str__(self):
        return f"{self.track.title} at position {self.position}"
