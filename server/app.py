from flask import jsonify

from controllers import main_controllers, auth_controllers, transcription_controller, notes_controllers, pdf_controller, questions_controller, tests_controller
from decorators import token_decorator
from config import app_setup

app = app_setup.flask_setup()
mongo_credentials = app_setup.mongodb_setup()

# JWT Token verification decorator
def token_required(f):
    return token_decorator.token_required(app=app,f=f)

@app.route("/")
def home():
    return main_controllers.home()

@app.route("/about")
def about():
  return jsonify({"message":"About Us"})

@app.route("/contact")
def contact():
  return jsonify({"message":"Contact"})


@app.route('/register', methods=['POST'])
def register():
    return auth_controllers.register(app,mongo_credentials['users_collection'])

@app.route('/login', methods=['POST'])
def login():
    return auth_controllers.login(app,mongo_credentials['users_collection'])

@app.route('/verify-token', methods=['POST'])
def verify_token():
    return auth_controllers.verify_token(app)

# Notes endpoints
@app.route('/notes', methods=['GET'])
@token_required
def get_notes(current_user_id):
    return notes_controllers.get_notes(mongo_credentials['notes_collection'],current_user_id)

@app.route('/notes', methods=['POST'])
@token_required
def create_note(current_user_id):
    return notes_controllers.create_note(mongo_credentials['notes_collection'],current_user_id)

@app.route('/notes/<note_id>', methods=['PUT'])
@token_required
def update_note(current_user_id, note_id):
    return notes_controllers.update_note(mongo_credentials['notes_collection'], current_user_id, note_id)

@app.route('/notes/<note_id>', methods=['DELETE'])
@token_required
def delete_note(current_user_id, note_id):
    return notes_controllers.delete_note(mongo_credentials['notes_collection'], current_user_id, note_id)

# Questions endpoints
@app.route('/questions', methods=['GET'])
@token_required
def get_questions(current_user_id):
    return questions_controller.get_questions(mongo_credentials['questions_collection'], current_user_id)

@app.route('/questions', methods=['POST'])
@token_required
def create_questions(current_user_id):
    return questions_controller.create_questions(mongo_credentials['questions_collection'], mongo_credentials['notes_collection'], current_user_id)

@app.route('/questions/<questions_id>', methods=['DELETE'])
@token_required
def delete_questions(current_user_id, questions_id):
    return questions_controller.delete_questions(mongo_credentials['questions_collection'], current_user_id, questions_id)

# Tests endpoints
@app.route('/tests', methods=['GET'])
@token_required
def get_tests(current_user_id):
    return tests_controller.get_tests(mongo_credentials['tests_collection'], current_user_id)

@app.route('/tests', methods=['POST'])
@token_required
def create_test(current_user_id):
    return tests_controller.create_test(mongo_credentials['tests_collection'], mongo_credentials['notes_collection'], current_user_id)

@app.route('/tests/<test_id>', methods=['GET'])
@token_required
def get_test(current_user_id, test_id):
    return tests_controller.get_test(mongo_credentials['tests_collection'], current_user_id, test_id)

@app.route('/tests/<test_id>', methods=['DELETE'])
@token_required
def delete_test(current_user_id, test_id):
    return tests_controller.delete_test(mongo_credentials['tests_collection'], current_user_id, test_id)

@app.route('/transcribe', methods=['POST'])
def generate_transcription():
    return transcription_controller.generate_transcription()

@app.route('/process-pdf', methods=['POST'])
def process_pdf():
    return pdf_controller.process_pdf()

if __name__ == '__main__':
  app.run(debug=True)