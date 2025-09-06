from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()

def flask_setup():
  app = Flask(__name__)
  CORS(app)
    # JWT Secret Key - In production, use a strong random key
  app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key-change-this-in-production')
  return app


def mongodb_setup():
  uri = os.getenv("MONGO_URI")
  db_name = os.getenv("DB_NAME")
  collection_name = os.getenv("COLLECTION_NAME")

  client = MongoClient(uri)
  db = client[db_name]
  users_collection = db[collection_name]
  notes_collection = db["notes"]
  questions_collection = db["questions"]
  tests_collection = db["tests"]
  mongo = {
    "users_collection":users_collection,
    "notes_collection":notes_collection,
    "questions_collection":questions_collection,
    "tests_collection":tests_collection
  }
  return mongo