from flask import jsonify, request
from youtube import yt
from genai import genai

def generate_transcription():
    try:
        data = request.get_json()
        you = data.get('yturl')

        ts = yt.get_transcription(you)

        result = genai.generate_summary(ts)

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
        return jsonify({"error": str(e)}), 500