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
from api_clients.properties_api import PropertiesAPI

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

# print("all docs:")
# get_all_documents(collection)

# example of creating a company
# company_data = {
#     "name": "Example Oil Co",
#     "description": "An example oil company",
#     "contact_info": {
#         "email": "contact@example.com",
#         "phone": "123-456-7890"
#     },
#     "created_at": datetime.now()
# }
# company_id = CompaniesAPI.create_company(company_data)
# print(f"Created company with ID: {company_id}") 

# example of creating a property
# property_data = {
#     "name": "Example Property",
#     "description": "An example property",
#     "address": {
#         "street": "123 Main St",
#         "city": "Anytown",
#         "state": "CA",
#         "zip": "12345"
#     },
#     "created_at": datetime.now()
# }
# property_id = PropertiesAPI.create_property(property_data)
# print(f"Created property with ID: {property_id}") 

