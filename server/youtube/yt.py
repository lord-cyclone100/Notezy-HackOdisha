from youtube_transcript_api import YouTubeTranscriptApi
import re
ytt_api = YouTubeTranscriptApi()
def get_transcription(link):
    transcript=""
    try:
        if 'shorts' in link:
            video_id = link.split('shorts/')[1]
        elif 'youtu.be' in link:
            match = re.search(r"youtu\.be/([a-zA-Z0-9_-]+)", link)
            if match:
                video_id = match.group(1)
        else: 
            video_id = link.split('=')[1]
        fetched_transcript = ytt_api.fetch(video_id, languages=['en', 'hi'])
        for snippet in fetched_transcript:
            transcript+=snippet.text
        return transcript
    except Exception as e:
        print(e)
        print("Hello")

# print(get_transcription("https://www.youtube.com/watch?v=l8seS3zyorc"))