from flask import request, jsonify
from datetime import datetime
from bson import ObjectId
from genai.genai import generate_questions

def get_questions(questions_collection, current_user_id):
    try:
        # Fetch all questions for the current user
        questions = list(questions_collection.find(
            {"user_id": current_user_id}
        ).sort("created_at", -1))
        
        # Convert ObjectId to string for JSON serialization
        for question in questions:
            question['_id'] = str(question['_id'])
            question['note_id'] = str(question['note_id'])
        
        return jsonify(questions), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_questions(questions_collection, notes_collection, current_user_id):
    try:
        data = request.get_json()
        note_id = data.get('note_id')
        
        if not note_id:
            return jsonify({'error': 'Note ID is required'}), 400
        
        # Verify the note belongs to the current user
        note = notes_collection.find_one({
            "_id": ObjectId(note_id),
            "user_id": current_user_id
        })
        
        if not note:
            return jsonify({'error': 'Note not found'}), 404
        
        # Generate questions using AI
        try:
            ai_response = generate_questions(note['content'])
            questions_text = ai_response.get('questions', '')
            
            if not questions_text:
                return jsonify({'error': 'Failed to generate questions'}), 500
                
        except Exception as e:
            return jsonify({'error': f'AI generation failed: {str(e)}'}), 500
        
        # Create questions document
        questions_doc = {
            "user_id": current_user_id,
            "note_id": ObjectId(note_id),
            "note_title": note['title'],
            "title": f"Questions for: {note['title'][:50]}{'...' if len(note['title']) > 50 else ''}",
            "content": questions_text,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert the questions
        result = questions_collection.insert_one(questions_doc)
        
        # Return the created questions with string ID
        questions_doc['_id'] = str(result.inserted_id)
        questions_doc['note_id'] = str(questions_doc['note_id'])
        
        return jsonify(questions_doc), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def delete_questions(questions_collection, current_user_id, questions_id):
    try:
        # Verify the questions belong to the current user and delete
        result = questions_collection.delete_one({
            "_id": ObjectId(questions_id),
            "user_id": current_user_id
        })
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Questions not found'}), 404
        
        return jsonify({'message': 'Questions deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
