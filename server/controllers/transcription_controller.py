from flask import jsonify, request
from youtube import yt
from genai import genai

def generate_transcription():
    try:
        data = request.get_json()
        you = data.get('yturl')
        
        if not you:
            return jsonify({"error": "YouTube URL is required"}), 400

        # Get transcript from YouTube
        try:
            ts = yt.get_transcription(you)
        except Exception as transcript_error:
            return jsonify({
                "error": f"Failed to fetch transcript: {str(transcript_error)}",
                "message": "Unable to fetch transcript from this YouTube video. This could be due to: 1) The video doesn't have captions/subtitles, 2) The video is private or restricted, 3) Invalid YouTube URL format, or 4) The video may not exist."
            }), 400

        # Generate summary using AI
        try:
            result = genai.generate_summary(ts)
        except Exception as ai_error:
            return jsonify({
                "error": f"Failed to generate summary: {str(ai_error)}",
                "message": "Successfully fetched transcript but failed to generate summary. Please try again."
            }), 500

        # Check if content is educational
        if not result.get('is_educational', True):
            return jsonify({
                'title': result['title'],
                'message': result['summary'],
                'is_educational': False
            }), 400  # Return 400 status for non-educational content

        return jsonify({
            'title': result['title'],
            'message': result['summary'],
            'is_educational': True
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "message": "An unexpected error occurred while processing the video."
        }), 500