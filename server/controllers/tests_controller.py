from flask import request, jsonify
from bson import ObjectId
from datetime import datetime

def get_tests(tests_collection, current_user_id):
    try:
        # Fetch all tests for the user
        tests = list(tests_collection.find({'user_id': current_user_id}).sort('created_at', -1))
        
        # Convert ObjectId to string
        for test in tests:
            test['_id'] = str(test['_id'])
        
        return jsonify({'tests': tests}), 200
    
    except Exception as e:
        print(f"Error fetching tests: {e}")
        return jsonify({'error': str(e)}), 500

def create_test(tests_collection, notes_collection, current_user_id):
    try:
        data = request.get_json()
        
        # Get the selected note IDs
        note_ids = data.get('note_ids', [])
        if not note_ids:
            return jsonify({'error': 'No notes selected for test generation'}), 400
        
        # Fetch the selected notes
        selected_notes = list(notes_collection.find({
            '_id': {'$in': [ObjectId(note_id) for note_id in note_ids]},
            'user_id': current_user_id
        }))
        
        if not selected_notes:
            return jsonify({'error': 'No valid notes found'}), 404
        
        # Combine content from all selected notes
        combined_content = ""
        note_titles = []
        for note in selected_notes:
            note_titles.append(note.get('title', 'Untitled'))
            combined_content += f"\n\n{note.get('title', 'Untitled')}:\n{note.get('summary', '')}"
        
        # Generate test using AI
        from genai.genai import generate_test
        test_result = generate_test(combined_content)
        
        # Create test document
        test_doc = {
            'user_id': current_user_id,
            'title': f"Test from {len(note_titles)} notes",
            'source_notes': note_titles,
            'source_note_ids': note_ids,
            'test_content': test_result.get('test', ''),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        # Insert into database
        result = tests_collection.insert_one(test_doc)
        test_doc['_id'] = str(result.inserted_id)
        
        return jsonify({
            'message': 'Test generated successfully',
            'test': test_doc
        }), 201
    
    except Exception as e:
        print(f"Error creating test: {e}")
        return jsonify({'error': str(e)}), 500

def get_test(tests_collection, current_user_id, test_id):
    try:
        # Fetch specific test
        test = tests_collection.find_one({
            '_id': ObjectId(test_id),
            'user_id': current_user_id
        })
        
        if not test:
            return jsonify({'error': 'Test not found'}), 404
        
        test['_id'] = str(test['_id'])
        return jsonify({'test': test}), 200
    
    except Exception as e:
        print(f"Error fetching test: {e}")
        return jsonify({'error': str(e)}), 500

def delete_test(tests_collection, current_user_id, test_id):
    try:
        # Delete the test
        result = tests_collection.delete_one({
            '_id': ObjectId(test_id),
            'user_id': current_user_id
        })
        
        if result.deleted_count == 0:
            return jsonify({'error': 'Test not found'}), 404
        
        return jsonify({'message': 'Test deleted successfully'}), 200
    
    except Exception as e:
        print(f"Error deleting test: {e}")
        return jsonify({'error': str(e)}), 500
