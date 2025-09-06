from flask import jsonify

def home():
  return jsonify({"message":"Home"})

def about():
  return jsonify({"message":"About Us"})

