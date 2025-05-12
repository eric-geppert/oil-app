from flask import Blueprint, request, jsonify
from api_clients.entries_api import EntriesAPI
from datetime import datetime

entries_bp = Blueprint('entries', __name__)

@entries_bp.route('/api/entries', methods=['GET'])
def get_entries():
    """Get all entries or filter by query parameters"""
    try:
        # Check if we need to filter by property, year, and month
        property_id = request.args.get('property_id')
        year = request.args.get('year')
        month = request.args.get('month')
        
        if property_id and year and month:
            try:
                year = int(year)
                month = int(month)
                entries = EntriesAPI.get_entries_by_property_year_month(property_id, year, month)
                return jsonify(entries), 200
            except ValueError:
                return jsonify({"error": "Invalid year or month format"}), 400
        
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

@entries_bp.route('/api/entries/<entry_id>', methods=['GET'])
def get_entry(entry_id):
    """Get a specific entry by ID"""
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

@entries_bp.route('/api/entries', methods=['POST'])
def create_entry():
    """Create a new entry"""
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

@entries_bp.route('/api/entries/<entry_id>', methods=['PUT'])
def update_entry(entry_id):
    """Update an existing entry"""
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

@entries_bp.route('/api/entries/<entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    """Delete an entry"""
    try:
        result = EntriesAPI.delete_entry(entry_id)
        if result == 0:
            return jsonify({"error": "Entry not found"}), 404
            
        return jsonify({"message": "Entry deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@entries_bp.route('/api/entries/<entry_id>/transactions/<transaction_id>', methods=['POST'])
def add_transaction_to_entry(entry_id, transaction_id):
    """Add a transaction to an entry"""
    try:
        result = EntriesAPI.add_transaction_to_entry(entry_id, transaction_id)
        if result == 0:
            return jsonify({"error": "Entry not found"}), 404
            
        return jsonify({"message": "Transaction added to entry successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@entries_bp.route('/api/entries/<entry_id>/transactions/<transaction_id>', methods=['DELETE'])
def remove_transaction_from_entry(entry_id, transaction_id):
    """Remove a transaction from an entry"""
    try:
        result = EntriesAPI.remove_transaction_from_entry(entry_id, transaction_id)
        if result == 0:
            return jsonify({"error": "Entry not found"}), 404
            
        return jsonify({"message": "Transaction removed from entry successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500 