from pymongo import MongoClient
from bson import ObjectId
from typing import Dict, List, Optional
from utils import create_document, get_document, get_all_documents, update_document, delete_document
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
                - gross_amount (float): Gross transaction amount (MANDATORY)
                - net_amount (float): Net transaction amount after deductions
                - taxes_paid_amount (float): Amount paid in taxes
                - date (datetime): Transaction date (MANDATORY)
                - property_id (str): ID of the property involved (MANDATORY)
                - company_from_id (str): ID of the company paying (MANDATORY)
                - company_to_id (str): ID of the company receiving payment (MANDATORY)
                - created_at (datetime): Creation timestamp
                - merchandise_transacted (str): ID of the merchandise transacted
                - amount_of_merch_transacted (float): Amount of merchandise transacted
                - merchandise_type (str): Type of merchandise involved
                - barrels_of_oil (float, optional): Number of barrels of oil involved
                - service (str, optional): Service provided
                
        Returns:
            str: The ID of the newly created transaction
            
        Raises:
            ValueError: If required fields are missing or if property_id/company IDs don't exist
        """
        # Validate required fields
        required_fields = ["gross_amount", "date", "property_id", "company_from_id", "company_to_id"]
        for field in required_fields:
            if field not in transaction_data:
                raise ValueError(f"The '{field}' field is mandatory and cannot be empty")
        
        # Validate that property_id exists in the properties collection
        property_id = transaction_data["property_id"]
        property_exists = properties_collection.find_one({"_id": ObjectId(property_id)})
        if not property_exists:
            raise ValueError(f"Property with ID '{property_id}' does not exist in the database")
        
        # Validate that company_from_id exists in the companies collection
        company_from_id = transaction_data["company_from_id"]
        company_from_exists = companies_collection.find_one({"_id": ObjectId(company_from_id)})
        if not company_from_exists:
            raise ValueError(f"Company with ID '{company_from_id}' (paying company) does not exist in the database")
        
        # Validate that company_to_id exists in the companies collection
        company_to_id = transaction_data["company_to_id"]
        company_to_exists = companies_collection.find_one({"_id": ObjectId(company_to_id)})
        if not company_to_exists:
            raise ValueError(f"Company with ID '{company_to_id}' (receiving company) does not exist in the database")
        
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
        return get_document(transactions_collection, {"_id": ObjectId(transaction_id)})

    @staticmethod
    def get_all_transactions() -> List[Dict]:
        """
        Retrieve all transactions from the database.
        
        Returns:
            List[Dict]: List of all transaction documents
        """
        return get_all_documents(transactions_collection)

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
            query (Dict): Search criteria (e.g., {"gross_amount": {"$gt": 1000}})
            
        Returns:
            List[Dict]: List of matching transaction documents
        """
        return list(transactions_collection.find(query))
        
    @staticmethod
    def get_transactions_by_property(property_id: str) -> List[Dict]:
        """
        Get all transactions for a specific property.
        
        Args:
            property_id (str): The ID of the property
            
        Returns:
            List[Dict]: List of transactions for the specified property
        """
        return list(transactions_collection.find({"property_id": property_id}))
        
    @staticmethod
    def get_transactions_by_company(company_id: str, direction: str = "both") -> List[Dict]:
        """
        Get all transactions involving a specific company.
        
        Args:
            company_id (str): The ID of the company
            direction (str): Which direction to search for transactions:
                - "from": Transactions where the company is paying
                - "to": Transactions where the company is receiving payment
                - "both": Both directions (default)
                
        Returns:
            List[Dict]: List of transactions involving the specified company
        """
        if direction == "from":
            return list(transactions_collection.find({"company_from_id": company_id}))
        elif direction == "to":
            return list(transactions_collection.find({"company_to_id": company_id}))
        else:  # both
            return list(transactions_collection.find({
                "$or": [
                    {"company_from_id": company_id},
                    {"company_to_id": company_id}
                ]
            }))
            
    @staticmethod
    def get_transactions_by_date_range(start_date: datetime, end_date: datetime) -> List[Dict]:
        """
        Get all transactions within a date range.
        
        Args:
            start_date (datetime): Start of the date range
            end_date (datetime): End of the date range
            
        Returns:
            List[Dict]: List of transactions within the specified date range
        """
        return list(transactions_collection.find({
            "date": {
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
    def get_transactions_by_amount_range(min_amount: float, max_amount: float, amount_type: str = "gross_amount") -> List[Dict]:
        """
        Get all transactions within an amount range.
        
        Args:
            min_amount (float): Minimum amount
            max_amount (float): Maximum amount
            amount_type (str): Type of amount to filter by (gross_amount, net_amount, taxes_paid_amount)
            
        Returns:
            List[Dict]: List of transactions within the specified amount range
        """
        if amount_type not in ["gross_amount", "net_amount", "taxes_paid_amount"]:
            raise ValueError("Amount type must be one of: gross_amount, net_amount, taxes_paid_amount")
            
        return list(transactions_collection.find({
            amount_type: {
                "$gte": min_amount,
                "$lte": max_amount
            }
        }))
        
    @staticmethod
    def get_total_transactions_by_property(property_id: str, amount_type: str = "gross_amount") -> float:
        """
        Calculate the total transaction amount for a property.
        
        Args:
            property_id (str): The ID of the property
            amount_type (str): Type of amount to sum (gross_amount, net_amount, taxes_paid_amount)
            
        Returns:
            float: Total transaction amount for the specified property
        """
        if amount_type not in ["gross_amount", "net_amount", "taxes_paid_amount"]:
            raise ValueError("Amount type must be one of: gross_amount, net_amount, taxes_paid_amount")
            
        transactions = list(transactions_collection.find({"property_id": property_id}))
        total_amount = sum(transaction.get(amount_type, 0) for transaction in transactions)
        return total_amount 