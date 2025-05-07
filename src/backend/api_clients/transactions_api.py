from pymongo import MongoClient
from bson import ObjectId
from typing import Dict, List, Optional
from utils import create_document, get_document, get_all_documents, update_document, delete_document, convert_objectid_to_str
from datetime import datetime

# MongoDB connection
uri = "mongodb+srv://ericgeppert04:Henry4likes2run@cluster0.pls3v.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)
db = client["db1"]
transactions_collection = db["transactions"]
properties_collection = db["properties"]
companies_collection = db["companies"]

class TransactionsAPI:
    @staticmethod
    def create_transaction(transaction_data: Dict) -> str:
        """
        Create a new transaction in the database.
        
        Args:
            transaction_data (Dict): Transaction information including:
                - property_id (str): ID of the property (MANDATORY)
                - company_id (str): ID of the company (MANDATORY)
                - transaction_date (datetime): Date of the transaction (MANDATORY)
                - amount (float): Amount of the transaction (MANDATORY)
                - merchandise_transacted (str, optional): Description of merchandise
                - amount_of_merch_transacted (float, optional): Amount of merchandise
                - merchandise_type (str, optional): Type of merchandise
                - barrels_of_oil (float, optional): Number of barrels of oil
                - service (str, optional): Service description
                - created_at (datetime): Creation timestamp
                
        Returns:
            str: The ID of the newly created transaction
            
        Raises:
            ValueError: If required fields are missing or invalid
        """
        # Validate required fields
        required_fields = ["property_id", "company_id", "transaction_date", "amount"]
        for field in required_fields:
            if field not in transaction_data:
                raise ValueError(f"The '{field}' field is mandatory and cannot be empty")
            
        # Validate amount is a number
        try:
            amount = float(transaction_data["amount"])
        except (ValueError, TypeError):
            raise ValueError("amount must be a valid number")
                
        # Validate optional amount fields if provided
        optional_amount_fields = ["amount_of_merch_transacted", "barrels_of_oil"]
        for field in optional_amount_fields:
            if field in transaction_data and transaction_data[field] is not None:
                try:
                    amount = float(transaction_data[field])
                except (ValueError, TypeError):
                    raise ValueError(f"{field} must be a valid number")
            
        # Add creation timestamp if not provided
        if "created_at" not in transaction_data:
            transaction_data["created_at"] = datetime.now()
            
        return str(create_document(transactions_collection, transaction_data))

    @staticmethod
    def get_transaction(transaction_id: str) -> Optional[Dict]:
        """
        Retrieve a transaction by its ID.
        
        Args:
            transaction_id (str): The ID of the transaction to retrieve
            
        Returns:
            Optional[Dict]: The transaction document if found, None otherwise
        """
        transaction = get_document(transactions_collection, {"_id": ObjectId(transaction_id)})
        return convert_objectid_to_str(transaction) if transaction else None

    @staticmethod
    def get_all_transactions() -> List[Dict]:
        """
        Retrieve all transactions from the database.
        
        Returns:
            List[Dict]: List of all transaction documents
        """
        transactions = list(transactions_collection.find())
        return [convert_objectid_to_str(transaction) for transaction in transactions]

    @staticmethod
    def update_transaction(transaction_id: str, update_data: Dict) -> int:
        """
        Update a transaction's information.
        
        Args:
            transaction_id (str): The ID of the transaction to update
            update_data (Dict): The fields to update and their new values
            
        Returns:
            int: Number of documents modified (1 if successful, 0 if not found)
        """
        # Validate amount is a number if it's being updated
        if "amount" in update_data:
            try:
                amount = float(update_data["amount"])
            except (ValueError, TypeError):
                raise ValueError("amount must be a valid number")
                    
        # Validate optional amount fields if provided
        optional_amount_fields = ["amount_of_merch_transacted", "barrels_of_oil"]
        for field in optional_amount_fields:
            if field in update_data and update_data[field] is not None:
                try:
                    amount = float(update_data[field])
                except (ValueError, TypeError):
                    raise ValueError(f"{field} must be a valid number")
                
        return update_document(transactions_collection, {"_id": ObjectId(transaction_id)}, update_data)

    @staticmethod
    def delete_transaction(transaction_id: str) -> int:
        """
        Delete a transaction from the database.
        
        Args:
            transaction_id (str): The ID of the transaction to delete
            
        Returns:
            int: Number of documents deleted (1 if successful, 0 if not found)
        """
        return delete_document(transactions_collection, {"_id": ObjectId(transaction_id)})

    @staticmethod
    def search_transactions(query: Dict) -> List[Dict]:
        """
        Search for transactions based on specific criteria.
        
        Args:
            query (Dict): Search criteria (e.g., {"property_id": "123"})
            
        Returns:
            List[Dict]: List of matching transaction documents
        """
        return list(transactions_collection.find(query))
        
    @staticmethod
    def get_transactions_by_property(property_id: str) -> List[Dict]:
        """
        Get all transactions for a specific property.
        
        Args:
            property_id (str): The property ID to search for
            
        Returns:
            List[Dict]: List of transactions for the specified property
        """
        return list(transactions_collection.find({"property_id": property_id}))
        
    @staticmethod
    def get_transactions_by_company(company_id: str) -> List[Dict]:
        """
        Get all transactions for a specific company.
        
        Args:
            company_id (str): The company ID to search for
            
        Returns:
            List[Dict]: List of transactions for the specified company
        """
        return list(transactions_collection.find({"company_id": company_id}))
        
    @staticmethod
    def get_transactions_by_date_range(start_date: datetime, end_date: datetime) -> List[Dict]:
        """
        Get all transactions within a date range.
        
        Args:
            start_date (datetime): Start of the date range
            end_date (datetime): End of the date range
            
        Returns:
            List[Dict]: List of transactions within the date range
        """
        return list(transactions_collection.find({
            "transaction_date": {
                "$gte": start_date,
                "$lte": end_date
            }
        }))
        
    @staticmethod
    def get_transactions_by_merchandise_type(merchandise_type: str) -> List[Dict]:
        """
        Get all transactions involving a specific merchandise type.
        
        Args:
            merchandise_type (str): The merchandise type to search for
            
        Returns:
            List[Dict]: List of transactions involving the specified merchandise type
        """
        return list(transactions_collection.find({
            "merchandise_type": merchandise_type
        }))
        
    @staticmethod
    def get_transactions_by_amount_range(min_amount: float, max_amount: float) -> List[Dict]:
        """
        Get all transactions within an amount range.
        
        Args:
            min_amount (float): Minimum amount
            max_amount (float): Maximum amount
            
        Returns:
            List[Dict]: List of transactions within the specified amount range
        """
        return list(transactions_collection.find({
            "amount": {
                "$gte": min_amount,
                "$lte": max_amount
            }
        }))
        
    @staticmethod
    def get_total_transactions_by_property(property_id: str) -> float:
        """
        Calculate the total transaction amount for a property.
        
        Args:
            property_id (str): The ID of the property
            
        Returns:
            float: Total transaction amount for the specified property
        """
        transactions = list(transactions_collection.find({"property_id": property_id}))
        total_amount = sum(transaction.get("amount", 0) for transaction in transactions)
        return total_amount 