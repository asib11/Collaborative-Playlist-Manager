"""
Management command to seed track library with sample data.
"""
from django.core.management.base import BaseCommand
from apps.tracks.models import Track


class Command(BaseCommand):
    help = 'Seed the track library with sample music data'
    
    def handle(self, *args, **kwargs):
        """Create sample tracks if they don't exist."""
        
        if Track.objects.exists():
            self.stdout.write(self.style.WARNING('Tracks already exist. Skipping seed.'))
            return
        
        tracks_data = [
            # Rock
            {'title': 'Bohemian Rhapsody', 'artist': 'Queen', 'album': 'A Night at the Opera', 'duration_seconds': 355, 'genre': 'rock'},
            {'title': 'Stairway to Heaven', 'artist': 'Led Zeppelin', 'album': 'Led Zeppelin IV', 'duration_seconds': 482, 'genre': 'rock'},
            {'title': 'Hotel California', 'artist': 'Eagles', 'album': 'Hotel California', 'duration_seconds': 391, 'genre': 'rock'},
            {'title': 'Sweet Child O Mine', 'artist': 'Guns N Roses', 'album': 'Appetite for Destruction', 'duration_seconds': 356, 'genre': 'rock'},
            {'title': 'Smells Like Teen Spirit', 'artist': 'Nirvana', 'album': 'Nevermind', 'duration_seconds': 301, 'genre': 'rock'},
            
            # Pop
            {'title': 'Billie Jean', 'artist': 'Michael Jackson', 'album': 'Thriller', 'duration_seconds': 294, 'genre': 'pop'},
            {'title': 'Shape of You', 'artist': 'Ed Sheeran', 'album': '÷ (Divide)', 'duration_seconds': 234, 'genre': 'pop'},
            {'title': 'Uptown Funk', 'artist': 'Mark Ronson ft. Bruno Mars', 'album': 'Uptown Special', 'duration_seconds': 269, 'genre': 'pop'},
            {'title': 'Blinding Lights', 'artist': 'The Weeknd', 'album': 'After Hours', 'duration_seconds': 200, 'genre': 'pop'},
            {'title': 'Rolling in the Deep', 'artist': 'Adele', 'album': '21', 'duration_seconds': 228, 'genre': 'pop'},
            
            # Electronic
            {'title': 'One More Time', 'artist': 'Daft Punk', 'album': 'Discovery', 'duration_seconds': 320, 'genre': 'electronic'},
            {'title': 'Strobe', 'artist': 'Deadmau5', 'album': 'For Lack of a Better Name', 'duration_seconds': 634, 'genre': 'electronic'},
            {'title': 'Midnight City', 'artist': 'M83', 'album': 'Hurry Up, We\'re Dreaming', 'duration_seconds': 244, 'genre': 'electronic'},
            {'title': 'Levels', 'artist': 'Avicii', 'album': 'Levels', 'duration_seconds': 203, 'genre': 'electronic'},
            {'title': 'Animals', 'artist': 'Martin Garrix', 'album': 'Animals', 'duration_seconds': 305, 'genre': 'electronic'},
            
            # Jazz
            {'title': 'Take Five', 'artist': 'Dave Brubeck', 'album': 'Time Out', 'duration_seconds': 324, 'genre': 'jazz'},
            {'title': 'So What', 'artist': 'Miles Davis', 'album': 'Kind of Blue', 'duration_seconds': 562, 'genre': 'jazz'},
            {'title': 'My Favorite Things', 'artist': 'John Coltrane', 'album': 'My Favorite Things', 'duration_seconds': 826, 'genre': 'jazz'},
            {'title': 'Fly Me to the Moon', 'artist': 'Frank Sinatra', 'album': 'It Might as Well Be Swing', 'duration_seconds': 148, 'genre': 'jazz'},
            {'title': 'Summertime', 'artist': 'Ella Fitzgerald', 'album': 'Porgy and Bess', 'duration_seconds': 318, 'genre': 'jazz'},
            
            # Classical
            {'title': 'Für Elise', 'artist': 'Ludwig van Beethoven', 'album': 'Bagatelle No. 25', 'duration_seconds': 180, 'genre': 'classical'},
            {'title': 'Clair de Lune', 'artist': 'Claude Debussy', 'album': 'Suite bergamasque', 'duration_seconds': 300, 'genre': 'classical'},
            {'title': 'The Four Seasons: Spring', 'artist': 'Antonio Vivaldi', 'album': 'The Four Seasons', 'duration_seconds': 630, 'genre': 'classical'},
            {'title': 'Symphony No. 5', 'artist': 'Ludwig van Beethoven', 'album': 'Symphony No. 5', 'duration_seconds': 420, 'genre': 'classical'},
            {'title': 'Canon in D', 'artist': 'Johann Pachelbel', 'album': 'Canon', 'duration_seconds': 330, 'genre': 'classical'},
            
            # Hip-Hop
            {'title': 'Lose Yourself', 'artist': 'Eminem', 'album': '8 Mile Soundtrack', 'duration_seconds': 326, 'genre': 'hip-hop'},
            {'title': 'HUMBLE.', 'artist': 'Kendrick Lamar', 'album': 'DAMN.', 'duration_seconds': 177, 'genre': 'hip-hop'},
            {'title': 'Sicko Mode', 'artist': 'Travis Scott', 'album': 'ASTROWORLD', 'duration_seconds': 312, 'genre': 'hip-hop'},
            {'title': 'God\'s Plan', 'artist': 'Drake', 'album': 'Scorpion', 'duration_seconds': 199, 'genre': 'hip-hop'},
            {'title': 'Alright', 'artist': 'Kendrick Lamar', 'album': 'To Pimp a Butterfly', 'duration_seconds': 219, 'genre': 'hip-hop'},
            
            # Indie/Alternative
            {'title': 'Mr. Brightside', 'artist': 'The Killers', 'album': 'Hot Fuss', 'duration_seconds': 222, 'genre': 'alternative'},
            {'title': 'Radioactive', 'artist': 'Imagine Dragons', 'album': 'Night Visions', 'duration_seconds': 187, 'genre': 'alternative'},
            {'title': 'Seven Nation Army', 'artist': 'The White Stripes', 'album': 'Elephant', 'duration_seconds': 231, 'genre': 'alternative'},
            {'title': 'Take Me Out', 'artist': 'Franz Ferdinand', 'album': 'Franz Ferdinand', 'duration_seconds': 237, 'genre': 'indie'},
            {'title': 'Do I Wanna Know?', 'artist': 'Arctic Monkeys', 'album': 'AM', 'duration_seconds': 272, 'genre': 'indie'},
        ]
        
        tracks = [Track(**data) for data in tracks_data]
        Track.objects.bulk_create(tracks)
        
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {len(tracks)} tracks')
        )
