from pymongo import MongoClient
from bson import ObjectId
from typing import Dict, List, Optional
from datetime import datetime
from utils import create_document, get_document, get_all_documents, update_document, delete_document

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
                - created_at (datetime): Creation timestamp
                
        Returns:
            str: The ID of the newly created entry
        """
        # Validate required fields
        required_fields = ["title", "transaction_ids", "entry_date", "entry_type", "status"]
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
        
        # Add creation timestamp if not provided
        if "created_at" not in entry_data:
            entry_data["created_at"] = datetime.now()
        
        # Convert transaction_ids to ObjectId if they're strings
        if "transaction_ids" in entry_data:
            entry_data["transaction_ids"] = [ObjectId(tid) if isinstance(tid, str) else tid for tid in entry_data["transaction_ids"]]
        
        return str(create_document(entries_collection, entry_data))

    @staticmethod
    def get_entry(entry_id: str) -> Optional[Dict]:
        """
        Retrieve an entry by its ID.
        
        Args:
            entry_id (str): The ID of the entry to retrieve
            
        Returns:
            Optional[Dict]: The entry document if found, None otherwise
        """
        return get_document(entries_collection, {"_id": ObjectId(entry_id)})

    @staticmethod
    def get_all_entries() -> List[Dict]:
        """
        Retrieve all entries from the database.
        
        Returns:
            List[Dict]: List of all entry documents
        """
        return get_all_documents(entries_collection)

    @staticmethod
    def update_entry(entry_id: str, update_data: Dict) -> int:
        """
        Update an entry's information.
        
        Args:
            entry_id (str): The ID of the entry to update
            update_data (Dict): The fields to update and their new values
            
        Returns:
            int: Number of documents modified (1 if successful, 0 if not found)
        """
        # Convert transaction_ids to ObjectId if they're strings
        if "transaction_ids" in update_data:
            update_data["transaction_ids"] = [ObjectId(tid) if isinstance(tid, str) else tid for tid in update_data["transaction_ids"]]
        
        return update_document(entries_collection, {"_id": ObjectId(entry_id)}, update_data)

    @staticmethod
    def delete_entry(entry_id: str) -> int:
        """
        Delete an entry from the database.
        
        Args:
            entry_id (str): The ID of the entry to delete
            
        Returns:
            int: Number of documents deleted (1 if successful, 0 if not found)
        """
        return delete_document(entries_collection, {"_id": ObjectId(entry_id)})

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
        
        entry = get_document(entries_collection, {"_id": ObjectId(entry_id)})
        if not entry:
            return None
        
        # Get all transactions for this entry
        transactions = []
        for transaction_id in entry.get("transaction_ids", []):
            transaction = TransactionsAPI.get_transaction(str(transaction_id))
            if transaction:
                transactions.append(transaction)
        
        # Add transactions to the entry
        entry["transactions"] = transactions
        
        return entry 