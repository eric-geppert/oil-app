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
from datetime import datetime
from api_clients.companies_api import CompaniesAPI

# print("at top")
# load_dotenv()
# todo: abstract later
# CONNECTION_STRING = os.getenv("mongodb+srv://ericgeppert04:Henry4likes2run@cluster0.pls3v.mongodb.net/")
#may need to url encode my pw ~ character??
# client = MongoClient(CONNECTION_STRING)


uri = "mongodb+srv://ericgeppert04:Henry4likes2run@cluster0.pls3v.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)

# try:
#     client.admin.command('ping')
#     print("Connected successfully!")
# except Exception as e:
#     print(f"Connection failed: {e}")



db = client["db1"] # Replace with your database name
collection = db["properties"] # Replace with your collection name

# Create a document
# new_document = {"name": "Example", "value": 123}
# print("all docs:")
# get_all_documents(collection)

company_data = {
    "name": "Example Oil Co",
    "description": "An example oil company",
    "contact_info": {
        "email": "contact@example.com",
        "phone": "123-456-7890"
    },
    "created_at": datetime.now()
}
company_id = CompaniesAPI.create_company(company_data)
print(f"Created company with ID: {company_id}") 


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