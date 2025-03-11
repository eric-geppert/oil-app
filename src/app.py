# from flask import Flask
# from flask_sqlalchemy import SQLAlchemy
# import os

# app = Flask(__name__)
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from utils import get_all_documents

print("at top")
# load_dotenv()
# todo: abstract later
# CONNECTION_STRING = os.getenv("mongodb+srv://ericgeppert04:Henry4likes2run@cluster0.pls3v.mongodb.net/")
#may need to url encode my pw ~ character??
# client = MongoClient(CONNECTION_STRING)


uri = "mongodb+srv://ericgeppert04:Henry4likes2run@cluster0.pls3v.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)

try:
    client.admin.command('ping')
    print("Connected successfully!")
except Exception as e:
    print(f"Connection failed: {e}")



db = client["sample_mflix"] # Replace with your database name
collection = db["users"] # Replace with your collection name

# Create a document
new_document = {"name": "Example", "value": 123}
print("all docs:")
get_all_documents(collection)
# inserted_id = create_document(collection,new_document)
# print(f"Inserted document with ID: {inserted_id}")

# # Read a document
# retrieved_document = get_document({"_id": inserted_id})
# print(f"Retrieved document: {retrieved_document}")

# # Update a document
# updated_count = update_document({"_id": inserted_id}, {"value": 456})
# print(f"Updated {updated_count} document(s)")

# # Read all documents
# all_documents = get_all_documents()
# print(f"All documents: {all_documents}")

# # Delete a document
# deleted_count = delete_document({"_id": inserted_id})
# print(f"Deleted {deleted_count} document(s)")

# if __name__ == '__main__':
#     app.run(debug=True)