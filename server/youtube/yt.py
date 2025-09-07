from youtube_transcript_api import YouTubeTranscriptApi
import re
ytt_api = YouTubeTranscriptApi()
def get_transcription(link):
    transcript=""
    try:
        # Extract video ID from different YouTube URL formats
        video_id = None
        if 'shorts' in link:
            video_id = link.split('shorts/')[1].split('?')[0]  # Remove query params
        elif 'youtu.be' in link:
            match = re.search(r"youtu\.be/([a-zA-Z0-9_-]+)", link)
            if match:
                video_id = match.group(1)
        elif 'watch?v=' in link:
            video_id = link.split('watch?v=')[1].split('&')[0]  # Handle additional params
        else:
            # Try to extract video ID using regex as fallback
            match = re.search(r"(?:v=|/)([a-zA-Z0-9_-]{11})", link)
            if match:
                video_id = match.group(1)
        
        if not video_id:
            raise ValueError("Invalid YouTube URL format")
            
        fetched_transcript = ytt_api.fetch(video_id, languages=['en', 'hi'])
        for snippet in fetched_transcript:
            transcript += snippet.text + " "
        
        if not transcript.strip():
            raise ValueError("No transcript found for this video")
            
        return transcript.strip()
    except Exception as e:
        print(f"Error fetching transcript: {e}")
        raise e  # Re-raise the exception to be handled by the controller

# print(get_transcription("https://www.youtube.com/watch?v=l8seS3zyorc"))