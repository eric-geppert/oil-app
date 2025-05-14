from pymongo import MongoClient
from bson import ObjectId
from typing import Dict, List, Optional
from utils import create_document, get_document, get_all_documents, update_document, delete_document
from datetime import datetime

# MongoDB connection
uri = "mongodb+srv://ericgeppert04:Henry4likes2run@cluster0.pls3v.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)
db = client["db1"]
accounts_collection = db["accounts"]

class AccountsAPI:
    @staticmethod
    def create_account(account_data: Dict) -> str:
        """
        Create a new account in the database.
        
        Args:
            account_data (Dict): Account information including:
                - name (str): Account name (MANDATORY)
                - account_type (str): Type of account (e.g., checking, savings) (MANDATORY)
                - account_number (str): Account number (MANDATORY)
                - balance (float): Account balance, can be positive or negative (MANDATORY)
                - bank_name (str, optional): Name of the bank
                - description (str, optional): Account description
                - status (str): Account status (active/inactive) (MANDATORY)
                - created_at (datetime): Creation timestamp
                
        Returns:
            str: The ID of the newly created account
            
        Raises:
            ValueError: If required fields are missing
        """
        # Validate required fields
        required_fields = ["name", "account_type", "account_number", "status", "balance"]
        for field in required_fields:
            if field not in account_data:
                raise ValueError(f"The '{field}' field is mandatory and cannot be empty")
            
        # Validate status is either active or inactive
        if account_data["status"] not in ["active", "inactive"]:
            raise ValueError("Status must be either 'active' or 'inactive'")
            
        # Validate balance is a number
        try:
            float(account_data["balance"])
        except (ValueError, TypeError):
            raise ValueError("Balance must be a valid number")
            
        # Add creation timestamp if not provided
        if "created_at" not in account_data:
            account_data["created_at"] = datetime.now()
            
        return str(create_document(accounts_collection, account_data))

    @staticmethod
    def get_account(account_id: str) -> Optional[Dict]:
        """
        Retrieve an account by its ID.
        
        Args:
            account_id (str): The ID of the account to retrieve
            
        Returns:
            Optional[Dict]: The account document if found, None otherwise
        """
        return get_document(accounts_collection, {"_id": ObjectId(account_id)})

    @staticmethod
    def get_all_accounts() -> List[Dict]:
        """
        Retrieve all accounts from the database.
        
        Returns:
            List[Dict]: List of all account documents
        """
        return get_all_documents(accounts_collection)

    @staticmethod
    def update_account(account_id: str, update_data: Dict) -> int:
        """
        Update an account's information.
        
        Args:
            account_id (str): The ID of the account to update
            update_data (Dict): The fields to update and their new values
            
        Returns:
            int: Number of documents modified (1 if successful, 0 if not found)
        """
        # Validate status is either active or inactive if it's being updated
        if "status" in update_data:
            if update_data["status"] not in ["active", "inactive"]:
                raise ValueError("Status must be either 'active' or 'inactive'")
                
        return update_document(accounts_collection, {"_id": ObjectId(account_id)}, update_data)

    @staticmethod
    def delete_account(account_id: str) -> int:
        """
        Delete an account from the database.
        
        Args:
            account_id (str): The ID of the account to delete
            
        Returns:
            int: Number of documents deleted (1 if successful, 0 if not found)
        """
        return delete_document(accounts_collection, {"_id": ObjectId(account_id)})

    @staticmethod
    def search_accounts(query: Dict) -> List[Dict]:
        """
        Search for accounts based on specific criteria.
        
        Args:
            query (Dict): Search criteria (e.g., {"account_type": "checking"})
            
        Returns:
            List[Dict]: List of matching account documents
        """
        return list(accounts_collection.find(query))
        
    @staticmethod
    def get_accounts_by_type(account_type: str) -> List[Dict]:
        """
        Get all accounts of a specific type.
        
        Args:
            account_type (str): The account type to search for
            
        Returns:
            List[Dict]: List of accounts with the specified type
        """
        return list(accounts_collection.find({"account_type": account_type}))
        
    @staticmethod
    def get_accounts_by_bank(bank_name: str) -> List[Dict]:
        """
        Get all accounts at a specific bank.
        
        Args:
            bank_name (str): The bank name to search for
            
        Returns:
            List[Dict]: List of accounts at the specified bank
        """
        return list(accounts_collection.find({"bank_name": bank_name}))
        
    @staticmethod
    def get_active_accounts() -> List[Dict]:
        """
        Get all active accounts.
        
        Returns:
            List[Dict]: List of active accounts
        """
        return list(accounts_collection.find({"status": "active"}))
        
    @staticmethod
    def get_inactive_accounts() -> List[Dict]:
        """
        Get all inactive accounts.
        
        Returns:
            List[Dict]: List of inactive accounts
        """
        return list(accounts_collection.find({"status": "inactive"}))
        
    @staticmethod
    def get_total_balance() -> float:
        """
        Calculate the total balance across all accounts.
        
        Returns:
            float: Total balance across all accounts
        """
        accounts = list(accounts_collection.find())
        total_balance = sum(account.get("balance", 0) for account in accounts)
        return total_balance
        
    @staticmethod
    def get_total_balance_by_type(account_type: str) -> float:
        """
        Calculate the total balance for accounts of a specific type.
        
        Args:
            account_type (str): The account type to sum balances for
            
        Returns:
            float: Total balance for accounts of the specified type
        """
        accounts = list(accounts_collection.find({"account_type": account_type}))
        total_balance = sum(account.get("balance", 0) for account in accounts)
        return total_balance
        
    @staticmethod
    def get_total_balance_by_bank(bank_name: str) -> float:
        """
        Calculate the total balance for accounts at a specific bank.
        
        Args:
            bank_name (str): The bank name to sum balances for
            
        Returns:
            float: Total balance for accounts at the specified bank
        """
        accounts = list(accounts_collection.find({"bank_name": bank_name}))
        total_balance = sum(account.get("balance", 0) for account in accounts)
        return total_balance 