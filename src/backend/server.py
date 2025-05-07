from flask import Flask, request, jsonify
from flask_cors import CORS
from api_clients.properties_api import PropertiesAPI
from api_clients.companies_api import CompaniesAPI
from api_clients.transactions_api import TransactionsAPI
from api_clients.company_ownership_api import CompanyOwnershipAPI
from api_clients.accounts_api import AccountsAPI
from api_clients.entries_api import EntriesAPI
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
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['property_id', 'company_id', 'transaction_date', 'amount']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
                
        # Validate amount is a number
        try:
            amount = float(data['amount'])
        except (ValueError, TypeError):
            return jsonify({'error': 'amount must be a valid number'}), 400
            
        # Create transaction
        transaction_id = TransactionsAPI.create_transaction(data)
        return jsonify({'_id': transaction_id}), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/transactions/<transaction_id>', methods=['PUT'])
def update_transaction(transaction_id):
    try:
        data = request.get_json()
        
        # Validate amount is a number if it's being updated
        if 'amount' in data:
            try:
                amount = float(data['amount'])
            except (ValueError, TypeError):
                return jsonify({'error': 'amount must be a valid number'}), 400
                
        # Update transaction
        result = TransactionsAPI.update_transaction(transaction_id, data)
        if result == 0:
            return jsonify({'error': 'Transaction not found'}), 404
        return jsonify({'message': 'Transaction updated successfully'}), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

# Accounts endpoints
@app.route('/api/accounts', methods=['GET'])
def get_accounts():
    try:
        accounts = AccountsAPI.get_all_accounts()
        return jsonify(accounts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/accounts/<account_id>', methods=['GET'])
def get_account(account_id):
    try:
        account_data = AccountsAPI.get_account(account_id)
        if account_data:
            return jsonify(account_data)
        return jsonify({"error": "Account not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/accounts', methods=['POST'])
def create_account():
    try:
        account_data = request.json
        account_id = AccountsAPI.create_account(account_data)
        return jsonify({"id": account_id, "message": "Account created successfully"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/accounts/<account_id>', methods=['PUT'])
def update_account(account_id):
    try:
        update_data = request.json
        result = AccountsAPI.update_account(account_id, update_data)
        if result:
            return jsonify({"message": "Account updated successfully"})
        return jsonify({"error": "Account not found"}), 404
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/accounts/<account_id>', methods=['DELETE'])
def delete_account(account_id):
    try:
        result = AccountsAPI.delete_account(account_id)
        if result:
            return jsonify({"message": "Account deleted successfully"})
        return jsonify({"error": "Account not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/accounts/type/<account_type>', methods=['GET'])
def get_accounts_by_type(account_type):
    try:
        accounts = AccountsAPI.get_accounts_by_type(account_type)
        return jsonify(accounts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/accounts/bank/<bank_name>', methods=['GET'])
def get_accounts_by_bank(bank_name):
    try:
        accounts = AccountsAPI.get_accounts_by_bank(bank_name)
        return jsonify(accounts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/accounts/active', methods=['GET'])
def get_active_accounts():
    try:
        accounts = AccountsAPI.get_active_accounts()
        return jsonify(accounts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/accounts/inactive', methods=['GET'])
def get_inactive_accounts():
    try:
        accounts = AccountsAPI.get_inactive_accounts()
        return jsonify(accounts)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Entries endpoints
@app.route('/api/entries', methods=['GET'])
def get_entries():
    try:
        # Check if we need to filter by type
        entry_type = request.args.get('type')
        if entry_type:
            entries = EntriesAPI.get_entries_by_type(entry_type)
            return jsonify(entries), 200
        
        # Check if we need to filter by status
        status = request.args.get('status')
        if status:
            entries = EntriesAPI.get_entries_by_status(status)
            return jsonify(entries), 200
        
        # Check if we need to filter by date range
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        if start_date and end_date:
            try:
                start = datetime.fromisoformat(start_date)
                end = datetime.fromisoformat(end_date)
                entries = EntriesAPI.get_entries_by_date_range(start, end)
                return jsonify(entries), 200
            except ValueError:
                return jsonify({"error": "Invalid date format. Use ISO format (YYYY-MM-DD)"}), 400
        
        # If no filters, get all entries
        entries = EntriesAPI.get_all_entries()
        return jsonify(entries), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/entries/<entry_id>', methods=['GET'])
def get_entry(entry_id):
    try:
        # Check if we want to include transactions
        include_transactions = request.args.get('include_transactions', 'false').lower() == 'true'
        
        if include_transactions:
            entry = EntriesAPI.get_entry_with_transactions(entry_id)
        else:
            entry = EntriesAPI.get_entry(entry_id)
            
        if not entry:
            return jsonify({"error": "Entry not found"}), 404
            
        return jsonify(entry), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/entries', methods=['POST'])
def create_entry():
    try:
        entry_data = request.json
        
        # Validate required fields
        required_fields = ["title", "transaction_ids", "entry_date", "entry_type", "status"]
        for field in required_fields:
            if field not in entry_data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Convert entry_date string to datetime if needed
        if isinstance(entry_data["entry_date"], str):
            try:
                entry_data["entry_date"] = datetime.fromisoformat(entry_data["entry_date"])
            except ValueError:
                return jsonify({"error": "Invalid date format. Use ISO format (YYYY-MM-DD)"}), 400
        
        entry_id = EntriesAPI.create_entry(entry_data)
        return jsonify({"id": entry_id, "message": "Entry created successfully"}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/entries/<entry_id>', methods=['PUT'])
def update_entry(entry_id):
    try:
        update_data = request.json
        
        # Convert entry_date string to datetime if needed
        if "entry_date" in update_data and isinstance(update_data["entry_date"], str):
            try:
                update_data["entry_date"] = datetime.fromisoformat(update_data["entry_date"])
            except ValueError:
                return jsonify({"error": "Invalid date format. Use ISO format (YYYY-MM-DD)"}), 400
        
        result = EntriesAPI.update_entry(entry_id, update_data)
        if result == 0:
            return jsonify({"error": "Entry not found"}), 404
            
        return jsonify({"message": "Entry updated successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/entries/<entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    try:
        result = EntriesAPI.delete_entry(entry_id)
        if result == 0:
            return jsonify({"error": "Entry not found"}), 404
            
        return jsonify({"message": "Entry deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/entries/<entry_id>/transactions/<transaction_id>', methods=['POST'])
def add_transaction_to_entry(entry_id, transaction_id):
    try:
        result = EntriesAPI.add_transaction_to_entry(entry_id, transaction_id)
        if result == 0:
            return jsonify({"error": "Entry not found"}), 404
            
        return jsonify({"message": "Transaction added to entry successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/entries/<entry_id>/transactions/<transaction_id>', methods=['DELETE'])
def remove_transaction_from_entry(entry_id, transaction_id):
    try:
        result = EntriesAPI.remove_transaction_from_entry(entry_id, transaction_id)
        if result == 0:
            return jsonify({"error": "Entry not found"}), 404
            
        return jsonify({"message": "Transaction removed from entry successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5001) 