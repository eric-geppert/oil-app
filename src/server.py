from flask import Flask, request, jsonify
from flask_cors import CORS
from api_clients.properties_api import PropertiesAPI
from api_clients.companies_api import CompaniesAPI
from api_clients.transactions_api import TransactionsAPI
from api_clients.company_ownership_api import CompanyOwnershipAPI
from bson import ObjectId
import json
from datetime import datetime

app = Flask(__name__)
# Configure CORS with specific settings
CORS(app, resources={
    r"/api/*": {
        "origins": ["http://localhost:3000"],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})

# Custom JSON encoder to handle MongoDB ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

app.json_encoder = JSONEncoder

# Helper function to convert ObjectId to string
def json_serial(obj):
    if isinstance(obj, ObjectId):
        return str(obj)
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")

# Properties endpoints
@app.route('/api/properties', methods=['GET'])
def get_properties():
    try:
        properties = PropertiesAPI.get_all_properties()
        return jsonify(properties)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/properties/<property_id>', methods=['GET'])
def get_property(property_id):
    try:
        property_data = PropertiesAPI.get_property(property_id)
        if property_data:
            return jsonify(property_data)
        return jsonify({"error": "Property not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/properties', methods=['POST'])
def create_property():
    try:
        property_data = request.json
        property_id = PropertiesAPI.create_property(property_data)
        return jsonify({"id": property_id, "message": "Property created successfully"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/properties/<property_id>', methods=['PUT'])
def update_property(property_id):
    try:
        update_data = request.json
        result = PropertiesAPI.update_property(property_id, update_data)
        if result:
            return jsonify({"message": "Property updated successfully"})
        return jsonify({"error": "Property not found"}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/properties/<property_id>', methods=['DELETE'])
def delete_property(property_id):
    try:
        result = PropertiesAPI.delete_property(property_id)
        if result:
            return jsonify({"message": "Property deleted successfully"})
        return jsonify({"error": "Property not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Companies endpoints
@app.route('/api/companies', methods=['GET'])
def get_companies():
    try:
        companies = CompaniesAPI.get_all_companies()
        return jsonify(companies)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/companies/<company_id>', methods=['GET'])
def get_company(company_id):
    try:
        company_data = CompaniesAPI.get_company(company_id)
        if company_data:
            return jsonify(company_data)
        return jsonify({"error": "Company not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/companies', methods=['POST'])
def create_company():
    try:
        company_data = request.json
        company_id = CompaniesAPI.create_company(company_data)
        return jsonify({"id": company_id, "message": "Company created successfully"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/companies/<company_id>', methods=['PUT'])
def update_company(company_id):
    try:
        update_data = request.json
        result = CompaniesAPI.update_company(company_id, update_data)
        if result:
            return jsonify({"message": "Company updated successfully"})
        return jsonify({"error": "Company not found"}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/companies/<company_id>', methods=['DELETE'])
def delete_company(company_id):
    try:
        result = CompaniesAPI.delete_company(company_id)
        if result:
            return jsonify({"message": "Company deleted successfully"})
        return jsonify({"error": "Company not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Transactions endpoints
@app.route('/api/transactions', methods=['GET'])
def get_transactions():
    try:
        transactions = TransactionsAPI.get_all_transactions()
        return jsonify(transactions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/transactions/<transaction_id>', methods=['GET'])
def get_transaction(transaction_id):
    try:
        transaction_data = TransactionsAPI.get_transaction(transaction_id)
        if transaction_data:
            return jsonify(transaction_data)
        return jsonify({"error": "Transaction not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/transactions', methods=['POST'])
def create_transaction():
    try:
        transaction_data = request.json
        transaction_id = TransactionsAPI.create_transaction(transaction_data)
        return jsonify({"id": transaction_id, "message": "Transaction created successfully"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/transactions/<transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    try:
        update_data = request.json
        result = TransactionsAPI.update_transaction(transaction_id, update_data)
        if result:
            return jsonify({"message": "Transaction updated successfully"})
        return jsonify({"error": "Transaction not found"}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/transactions/<transaction_id>', methods=['DELETE'])
def delete_transaction(transaction_id):
    try:
        result = TransactionsAPI.delete_transaction(transaction_id)
        if result:
            return jsonify({"message": "Transaction deleted successfully"})
        return jsonify({"error": "Transaction not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Company Ownership endpoints
@app.route('/api/company-ownership', methods=['GET'])
def get_company_ownerships():
    try:
        ownerships = CompanyOwnershipAPI.get_all_company_ownerships()
        return jsonify(ownerships)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/company-ownership/<ownership_id>', methods=['GET'])
def get_company_ownership(ownership_id):
    try:
        ownership_data = CompanyOwnershipAPI.get_company_ownership(ownership_id)
        if ownership_data:
            return jsonify(ownership_data)
        return jsonify({"error": "Company ownership record not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/company-ownership', methods=['POST'])
def create_company_ownership():
    try:
        ownership_data = request.json
        ownership_id = CompanyOwnershipAPI.create_company_ownership(ownership_data)
        return jsonify({"id": ownership_id, "message": "Company ownership record created successfully"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/company-ownership/<ownership_id>', methods=['PUT'])
def update_company_ownership(ownership_id):
    try:
        update_data = request.json
        result = CompanyOwnershipAPI.update_company_ownership(ownership_id, update_data)
        if result:
            return jsonify({"message": "Company ownership record updated successfully"})
        return jsonify({"error": "Company ownership record not found"}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/company-ownership/<ownership_id>', methods=['DELETE'])
def delete_company_ownership(ownership_id):
    try:
        result = CompanyOwnershipAPI.delete_company_ownership(ownership_id)
        if result:
            return jsonify({"message": "Company ownership record deleted successfully"})
        return jsonify({"error": "Company ownership record not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 