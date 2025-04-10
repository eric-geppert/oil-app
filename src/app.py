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
from datetime import datetime, timedelta
from api_clients.companies_api import CompaniesAPI
from api_clients.properties_api import PropertiesAPI
from api_clients.transactions_api import TransactionsAPI
from api_clients.company_ownership_api import CompanyOwnershipAPI
from api_clients.accounts_api import AccountsAPI
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
#     "name": "Property 4",
#     "description": "An example property",
#     "address": {
#         "street": "4 Main St",
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
# company_ownership_data = {
#     "company_id": "67f155eb4ba1f1b5f6ba6008",  # Replace with actual company ID
#     "property_id": "67f43387028deb3f8cd2ed1c",  # Replace with actual property ID
#     "interest_type": "working",  # e.g., royalty, working
#     "percentage": 100.0,  # Must be between 0-100
#     "is_current_owner": False,  # Whether company currently owns this interest
#     "date_from": datetime.now() - timedelta(days=30),  # Start date of ownership (1 month ago)
#     "date_to": datetime.now(),  # End date (None since is_current_owner is True)
#     "well_type": "oil",  # Optional well type
#     "created_at": datetime.now(),  # Creation timestamp
# }

# try:
#     company_ownership_id = CompanyOwnershipAPI.create_company_ownership(company_ownership_data)
#     print(f"Created company ownership with ID: {company_ownership_id}")
# except ValueError as e:
#     print(f"Error creating company ownership: {e}")


# Example of creating an account
account_data = {
    "name": "Example Account",
    "account_type": "checking",  # e.g., checking, savings, investment
    "account_number": "2001",
    "status": "active",
    "description": "for debt stuffs"
    "created_at": datetime.now()
}
account_id = AccountsAPI.create_account(account_data)
print(f"Created account with ID: {account_id}")       