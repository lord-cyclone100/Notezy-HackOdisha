from datetime import datetime
from flask import jsonify, request
from decorators import token_decorator

# JWT Token verification decorator
# def token_required(f):
#     return token_decorator.token_required(app=app,f=f)


# @token_required
def get_notes(notes_collection,current_user_id):
    try:
        notes = list(notes_collection.find({"user_id": current_user_id}))
        
        # Convert ObjectId to string for JSON serialization
        for note in notes:
            note['_id'] = str(note['_id'])
        
        return jsonify({'notes': notes}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def create_note(notes_collection,current_user_id):
    try:
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        
        if not title:
            return jsonify({"error": "Title is required"}), 400
        
        note_data = {
            "user_id": current_user_id,
            "title": title,
            "content": content or "",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = notes_collection.insert_one(note_data)
        note_id = str(result.inserted_id)
        
        note_data['_id'] = note_id
        
        return jsonify({
            "message": "Note created successfully",
            "note": note_data
        }), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def update_note(notes_collection, current_user_id, note_id):
    try:
        from bson import ObjectId
        
        data = request.get_json()
        title = data.get('title')
        content = data.get('content')
        
        if not title:
            return jsonify({"error": "Title is required"}), 400
        
        # Find the note and verify ownership
        note = notes_collection.find_one({"_id": ObjectId(note_id), "user_id": current_user_id})
        if not note:
            return jsonify({"error": "Note not found or access denied"}), 404
        
        # Update the note
        update_data = {
            "title": title,
            "content": content or "",
            "updated_at": datetime.utcnow()
        }
        
        notes_collection.update_one(
            {"_id": ObjectId(note_id), "user_id": current_user_id},
            {"$set": update_data}
        )
        
        # Get the updated note
        updated_note = notes_collection.find_one({"_id": ObjectId(note_id)})
        updated_note['_id'] = str(updated_note['_id'])
        
        return jsonify({
            "message": "Note updated successfully",
            "note": updated_note
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
def delete_note(notes_collection, current_user_id, note_id):
    try:
        from bson import ObjectId
        
        # Find the note and verify ownership
        note = notes_collection.find_one({"_id": ObjectId(note_id), "user_id": current_user_id})
        if not note:
            return jsonify({"error": "Note not found or access denied"}), 404
        
        # Delete the note
        notes_collection.delete_one({"_id": ObjectId(note_id), "user_id": current_user_id})
        
        return jsonify({"message": "Note deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500