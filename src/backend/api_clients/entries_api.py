from pymongo import MongoClient
from bson import ObjectId
from typing import Dict, List, Optional
from datetime import datetime
from utils import create_document, get_document, get_all_documents, update_document, delete_document
from utils import convert_objectid_to_str

# MongoDB connection
uri = "mongodb+srv://ericgeppert04:Henry4likes2run@cluster0.pls3v.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)
db = client["db1"]
entries_collection = db["entries"]

class EntriesAPI:
    @staticmethod
    def create_entry(entry_data: Dict) -> str:
        """
        Create a new entry in the database.
        
        Args:
            entry_data (Dict): Entry information including:
                - title (str): Entry title
                - description (str, optional): Entry description
                - transaction_ids (List[str]): List of transaction IDs included in this entry
                - entry_date (datetime): Date of the entry
                - entry_type (str): Type of entry (e.g., 'monthly', 'quarterly', 'annual')
                - status (str): Status of the entry (e.g., 'draft', 'submitted', 'approved')
                - posted (bool): Whether the entry has been posted (MANDATORY)
                - created_at (datetime): Creation timestamp
                
        Returns:
            str: The ID of the newly created entry
        """
        # Validate required fields
        required_fields = ["title", "transaction_ids", "entry_date", "entry_type", "status", "posted"]
        for field in required_fields:
            if field not in entry_data:
                raise ValueError(f"Missing required field: {field}")
        
        # Validate entry_type
        valid_entry_types = ["monthly", "quarterly", "annual", "custom"]
        if entry_data["entry_type"] not in valid_entry_types:
            raise ValueError(f"Invalid entry_type. Must be one of: {valid_entry_types}")
        
        # Validate status
        valid_statuses = ["draft", "submitted", "approved", "rejected"]
        if entry_data["status"] not in valid_statuses:
            raise ValueError(f"Invalid status. Must be one of: {valid_statuses}")
        
        # Validate posted is boolean
        if not isinstance(entry_data["posted"], bool):
            raise ValueError("posted must be a boolean value")
        
        # Add creation timestamp if not provided
        if "created_at" not in entry_data:
            entry_data["created_at"] = datetime.now()
        
        # Convert transaction_ids to ObjectId if they're strings
        if "transaction_ids" in entry_data:
            entry_data["transaction_ids"] = [ObjectId(tid) if isinstance(tid, str) else tid for tid in entry_data["transaction_ids"]]
        
        # Convert entry_date string to datetime if needed
        if isinstance(entry_data.get("entry_date"), str):
            entry_data["entry_date"] = datetime.fromisoformat(entry_data["entry_date"])
        
        result = create_document(entries_collection, entry_data)
        return str(result)

    @staticmethod
    def get_entry(entry_id: str) -> Optional[Dict]:
        """
        Retrieve an entry by its ID.
        
        Args:
            entry_id (str): The ID of the entry to retrieve
            
        Returns:
            Optional[Dict]: The entry document if found, None otherwise
        """
        entry = get_document(entries_collection, {"_id": ObjectId(entry_id)})
        return convert_objectid_to_str(entry) if entry else None

    @staticmethod
    def get_all_entries() -> List[Dict]:
        """
        Retrieve all entries from the database.
        
        Returns:
            List[Dict]: List of all entry documents
        """
        entries = list(entries_collection.find())
        # Convert all ObjectIds to strings, including nested ones
        return [convert_objectid_to_str(entry) for entry in entries]

    @staticmethod
    def update_entry(entry_id: str, update_data: Dict) -> bool:
        """
        Update an entry's information.
        
        Args:
            entry_id (str): The ID of the entry to update
            update_data (Dict): The fields to update and their new values
            
        Returns:
            bool: True if the entry was updated, False otherwise
        """
        # Convert string IDs to ObjectId
        if "transaction_ids" in update_data:
            update_data["transaction_ids"] = [ObjectId(tid) for tid in update_data["transaction_ids"]]
        
        # Convert entry_date string to datetime if needed
        if isinstance(update_data.get("entry_date"), str):
            update_data["entry_date"] = datetime.fromisoformat(update_data["entry_date"])
        
        result = update_document(entries_collection, {"_id": ObjectId(entry_id)}, update_data)
        return result > 0

    @staticmethod
    def delete_entry(entry_id: str) -> bool:
        """
        Delete an entry from the database.
        
        Args:
            entry_id (str): The ID of the entry to delete
            
        Returns:
            bool: True if the entry was deleted, False otherwise
        """
        result = delete_document(entries_collection, {"_id": ObjectId(entry_id)})
        return result > 0

    @staticmethod
    def search_entries(query: Dict) -> List[Dict]:
        """
        Search for entries based on specific criteria.
        
        Args:
            query (Dict): Search criteria (e.g., {"title": {"$regex": "search_term", "$options": "i"}})
            
        Returns:
            List[Dict]: List of matching entry documents
        """
        return list(entries_collection.find(query))
    
    @staticmethod
    def get_entries_by_type(entry_type: str) -> List[Dict]:
        """
        Get all entries of a specific type.
        
        Args:
            entry_type (str): The type of entries to retrieve
            
        Returns:
            List[Dict]: List of entries with the specified type
        """
        return list(entries_collection.find({"entry_type": entry_type}))
    
    @staticmethod
    def get_entries_by_status(status: str) -> List[Dict]:
        """
        Get all entries with a specific status.
        
        Args:
            status (str): The status of entries to retrieve
            
        Returns:
            List[Dict]: List of entries with the specified status
        """
        return list(entries_collection.find({"status": status}))
    
    @staticmethod
    def get_entries_by_date_range(start_date: datetime, end_date: datetime) -> List[Dict]:
        """
        Get all entries within a date range.
        
        Args:
            start_date (datetime): Start date (inclusive)
            end_date (datetime): End date (inclusive)
            
        Returns:
            List[Dict]: List of entries within the date range
        """
        return list(entries_collection.find({
            "entry_date": {
                "$gte": start_date,
                "$lte": end_date
            }
        }))
    
    @staticmethod
    def add_transaction_to_entry(entry_id: str, transaction_id: str) -> int:
        """
        Add a transaction to an existing entry.
        
        Args:
            entry_id (str): The ID of the entry
            transaction_id (str): The ID of the transaction to add
            
        Returns:
            int: Number of documents modified (1 if successful, 0 if not found)
        """
        return update_document(
            entries_collection, 
            {"_id": ObjectId(entry_id)}, 
            {"$addToSet": {"transaction_ids": ObjectId(transaction_id)}}
        )
    
    @staticmethod
    def remove_transaction_from_entry(entry_id: str, transaction_id: str) -> int:
        """
        Remove a transaction from an existing entry.
        
        Args:
            entry_id (str): The ID of the entry
            transaction_id (str): The ID of the transaction to remove
            
        Returns:
            int: Number of documents modified (1 if successful, 0 if not found)
        """
        return update_document(
            entries_collection, 
            {"_id": ObjectId(entry_id)}, 
            {"$pull": {"transaction_ids": ObjectId(transaction_id)}}
        )
    
    @staticmethod
    def get_entry_with_transactions(entry_id: str) -> Optional[Dict]:
        """
        Get an entry with its associated transactions.
        
        Args:
            entry_id (str): The ID of the entry
            
        Returns:
            Optional[Dict]: The entry document with transactions if found, None otherwise
        """
        from api_clients.transactions_api import TransactionsAPI
        
        # Get the entry and convert its ObjectIds to strings
        entry = get_document(entries_collection, {"_id": ObjectId(entry_id)})
        if not entry:
            return None
        
        # Convert entry to dict and handle ObjectId
        entry_dict = convert_objectid_to_str(entry)
        
        # Get transactions and ensure their ObjectIds are converted to strings
        transaction_ids = entry.get("transaction_ids", [])
        transactions = []
        for tid in transaction_ids:
            # Convert ObjectId to string if it's not already a string
            tid_str = str(tid) if isinstance(tid, ObjectId) else tid
            transaction = TransactionsAPI.get_transaction(tid_str)
            if transaction:
                # Convert any remaining ObjectIds in the transaction to strings
                transaction = convert_objectid_to_str(transaction)
                # Ensure all nested fields are also converted
                if isinstance(transaction, dict):
                    for key, value in transaction.items():
                        if isinstance(value, ObjectId):
                            transaction[key] = str(value)
                transactions.append(transaction)
        
        # Add transactions to the entry
        entry_dict["transactions"] = transactions
        return entry_dict 

    @staticmethod
    def get_entries_by_property_year_month(property_id: str, year: int, month: int) -> List[Dict]:
        """
        Get all entries for a specific property, year, and month.
        
        Args:
            property_id (str): The ID of the property
            year (int): The year to filter by
            month (int): The month to filter by (1-12)
            
        Returns:
            List[Dict]: List of entries matching the criteria
        """
        # Create start and end dates for the specified month
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        
        # Find entries within the date range
        entries = list(entries_collection.find({
            "entry_date": {
                "$gte": start_date,
                "$lt": end_date
            }
        }))
        
        # Convert ObjectIds to strings
        return [convert_objectid_to_str(entry) for entry in entries] 

    @staticmethod
    def update_entry_posted_status(entry_id: str, posted: bool) -> bool:
        """
        Update the posted status of an entry.
        
        Args:
            entry_id (str): The ID of the entry to update
            posted (bool): The new posted status
            
        Returns:
            bool: True if the entry was updated, False otherwise
        """
        result = update_document(
            entries_collection,
            {"_id": ObjectId(entry_id)},
            {"posted": posted}
        )
        return result > 0 