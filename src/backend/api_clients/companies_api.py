from pymongo import MongoClient
from bson import ObjectId
from typing import Dict, List, Optional
from utils import create_document, get_document, get_all_documents, update_document, delete_document

# MongoDB connection
uri = "mongodb+srv://ericgeppert04:Henry4likes2run@cluster0.pls3v.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)
db = client["db1"]
companies_collection = db["companies"]

class CompaniesAPI:
    @staticmethod
    def create_company(company_data: Dict) -> str:
        """
        Create a new company in the database.
        
        Args:
            company_data (Dict): Company information including:
                - name (str): Company name
                - description (str, optional): Company description
                - contact_info (Dict, optional): Contact information
                - created_at (datetime): Creation timestamp
                
        Returns:
            str: The ID of the newly created company
        """
        return str(create_document(companies_collection, company_data))

    @staticmethod
    def get_company(company_id: str) -> Optional[Dict]:
        """
        Retrieve a company by its ID.
        
        Args:
            company_id (str): The ID of the company to retrieve
            
        Returns:
            Optional[Dict]: The company document if found, None otherwise
        """
        return get_document(companies_collection, {"_id": ObjectId(company_id)})

    @staticmethod
    def get_all_companies() -> List[Dict]:
        """
        Retrieve all companies from the database.
        
        Returns:
            List[Dict]: List of all company documents
        """
        return get_all_documents(companies_collection)

    @staticmethod
    def update_company(company_id: str, update_data: Dict) -> int:
        """
        Update a company's information.
        
        Args:
            company_id (str): The ID of the company to update
            update_data (Dict): The fields to update and their new values
            
        Returns:
            int: Number of documents modified (1 if successful, 0 if not found)
        """
        return update_document(companies_collection, {"_id": ObjectId(company_id)}, update_data)

    @staticmethod
    def delete_company(company_id: str) -> int:
        """
        Delete a company from the database.
        
        Args:
            company_id (str): The ID of the company to delete
            
        Returns:
            int: Number of documents deleted (1 if successful, 0 if not found)
        """
        return delete_document(companies_collection, {"_id": ObjectId(company_id)})

    @staticmethod
    def search_companies(query: Dict) -> List[Dict]:
        """
        Search for companies based on specific criteria.
        
        Args:
            query (Dict): Search criteria (e.g., {"name": {"$regex": "search_term", "$options": "i"}})
            
        Returns:
            List[Dict]: List of matching company documents
        """
        return list(companies_collection.find(query))
