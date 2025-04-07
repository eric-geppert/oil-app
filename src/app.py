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
from api_clients.transactions_api import TransactionsAPI
from api_clients.company_ownership_api import CompanyOwnershipAPI
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

# Example of creating a transaction
# transaction_data = {
#     "amount": 50000.00,
#     "date": datetime.now(),
#     "property_id": "67f15c14e28ed6d05e160734",  # Replace with actual property ID
#     "company_from_id": "67f14a5fe7a9f8ab13b26488", # Replace with actual company ID (paying)
#     "company_to_id": "67f14f91e7a9f8ab13b2649d", # Replace with actual company ID (receiving)
#     "merchandise_transacted": "crude_oil",
#     "amount_of_merch_transacted": 1000.0,
#     "merchandise_type": "natural gas",
#     "barrels_of_oil": 1000.0,
#     "service": "oil_sale",
#     "created_at": datetime.now()
# }

# try:
#     transaction_id = TransactionsAPI.create_transaction(transaction_data)
#     print(f"Created transaction with ID: {transaction_id}")
# except ValueError as e:
#     print(f"Error creating transaction: {e}")

# Example of creating a company ownership
company_ownership_data = {
    "property_id": "67f15c14e28ed6d05e160734",  # Replace with actual property ID
    "company_id": "67f14a5fe7a9f8ab13b26488",  # Replace with actual company ID
    "percentage_ownership": 50.0,
    "interest_type": "working",
    "well_type": "oil"
}

try:
    company_ownership_id = CompanyOwnershipAPI.create_company_ownership(company_ownership_data)
    print(f"Created company ownership with ID: {company_ownership_id}")
except ValueError as e:
    print(f"Error creating company ownership: {e}")

# Example of creating a user