from pymongo import MongoClient
from bson import ObjectId
from typing import Dict, List, Optional
from utils import create_document, get_document, get_all_documents, update_document, delete_document
from datetime import datetime

# MongoDB connection
uri = "mongodb+srv://ericgeppert04:Henry4likes2run@cluster0.pls3v.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)
db = client["db1"]
company_ownership_collection = db["company_ownership"]
properties_collection = db["properties"]
companies_collection = db["companies"]

class CompanyOwnershipAPI:
    @staticmethod
    def create_company_ownership(ownership_data: Dict) -> str:
        """
        Create a new company ownership record in the database.
        
        Args:
            ownership_data (Dict): Company ownership information including:
                - property_id (str): ID of the property being leased (MANDATORY)
                - company_id (str): ID of the company leasing the property (MANDATORY)
                - percentage_ownership (float): Percentage ownership (MANDATORY)
                - interest_type (str): Type of interest (working/royalty) (MANDATORY)
                - well_type (str, optional): Type of well (e.g., oil/natural gas)
                - created_at (datetime): Creation timestamp
                
        Returns:
            str: The ID of the newly created company ownership record
            
        Raises:
            ValueError: If required fields are missing or if property_id/company_id don't exist
        """
        # Validate required fields
        required_fields = ["property_id", "company_id", "percentage_ownership", "interest_type"]
        for field in required_fields:
            if field not in ownership_data:
                raise ValueError(f"The '{field}' field is mandatory and cannot be empty")
        
        # Validate that property_id exists in the properties collection
        property_id = ownership_data["property_id"]
        property_exists = properties_collection.find_one({"_id": ObjectId(property_id)})
        if not property_exists:
            raise ValueError(f"Property with ID '{property_id}' does not exist in the database")
        
        # Validate that company_id exists in the companies collection
        company_id = ownership_data["company_id"]
        company_exists = companies_collection.find_one({"_id": ObjectId(company_id)})
        if not company_exists:
            raise ValueError(f"Company with ID '{company_id}' does not exist in the database")
        
        # Validate interest_type is either 'working' or 'royalty'
        interest_type = ownership_data["interest_type"]
        if interest_type not in ["working", "royalty"]:
            raise ValueError("Interest type must be either 'working' or 'royalty'")
        
        # Add creation timestamp if not provided
        if "created_at" not in ownership_data:
            ownership_data["created_at"] = datetime.now()
            
        return str(create_document(company_ownership_collection, ownership_data))

    @staticmethod
    def get_company_ownership(ownership_id: str) -> Optional[Dict]:
        """
        Retrieve a company ownership record by its ID.
        
        Args:
            ownership_id (str): The ID of the company ownership record to retrieve
            
        Returns:
            Optional[Dict]: The company ownership document if found, None otherwise
        """
        return get_document({"_id": ObjectId(ownership_id)})

    @staticmethod
    def get_all_company_ownerships() -> List[Dict]:
        """
        Retrieve all company ownership records from the database.
        
        Returns:
            List[Dict]: List of all company ownership documents
        """
        return get_all_documents(company_ownership_collection)

    @staticmethod
    def update_company_ownership(ownership_id: str, update_data: Dict) -> int:
        """
        Update a company ownership record's information.
        
        Args:
            ownership_id (str): The ID of the company ownership record to update
            update_data (Dict): The fields to update and their new values
            
        Returns:
            int: Number of documents modified (1 if successful, 0 if not found)
        """
        # Validate interest_type if it's being updated
        if "interest_type" in update_data:
            interest_type = update_data["interest_type"]
            if interest_type not in ["working", "royalty"]:
                raise ValueError("Interest type must be either 'working' or 'royalty'")
                
        return update_document({"_id": ObjectId(ownership_id)}, update_data)

    @staticmethod
    def delete_company_ownership(ownership_id: str) -> int:
        """
        Delete a company ownership record from the database.
        
        Args:
            ownership_id (str): The ID of the company ownership record to delete
            
        Returns:
            int: Number of documents deleted (1 if successful, 0 if not found)
        """
        return delete_document({"_id": ObjectId(ownership_id)})

    @staticmethod
    def search_company_ownerships(query: Dict) -> List[Dict]:
        """
        Search for company ownership records based on specific criteria.
        
        Args:
            query (Dict): Search criteria (e.g., {"percentage_ownership": {"$gt": 50}})
            
        Returns:
            List[Dict]: List of matching company ownership documents
        """
        return list(company_ownership_collection.find(query))
        
    @staticmethod
    def get_ownerships_by_property(property_id: str) -> List[Dict]:
        """
        Get all company ownership records for a specific property.
        
        Args:
            property_id (str): The ID of the property
            
        Returns:
            List[Dict]: List of company ownership records for the specified property
        """
        return list(company_ownership_collection.find({"property_id": property_id}))
        
    @staticmethod
    def get_ownerships_by_company(company_id: str) -> List[Dict]:
        """
        Get all company ownership records for a specific company.
        
        Args:
            company_id (str): The ID of the company
            
        Returns:
            List[Dict]: List of company ownership records for the specified company
        """
        return list(company_ownership_collection.find({"company_id": company_id}))
        
    @staticmethod
    def get_ownerships_by_interest_type(interest_type: str) -> List[Dict]:
        """
        Get all company ownership records for a specific interest type.
        
        Args:
            interest_type (str): The interest type to search for (working/royalty)
            
        Returns:
            List[Dict]: List of company ownership records for the specified interest type
        """
        if interest_type not in ["working", "royalty"]:
            raise ValueError("Interest type must be either 'working' or 'royalty'")
            
        return list(company_ownership_collection.find({"interest_type": interest_type}))
        
    @staticmethod
    def get_ownerships_by_percentage_range(min_percentage: float, max_percentage: float) -> List[Dict]:
        """
        Get all company ownership records within a percentage range.
        
        Args:
            min_percentage (float): Minimum percentage ownership
            max_percentage (float): Maximum percentage ownership
            
        Returns:
            List[Dict]: List of company ownership records within the specified percentage range
        """
        return list(company_ownership_collection.find({
            "percentage_ownership": {
                "$gte": min_percentage,
                "$lte": max_percentage
            }
        }))
        
    @staticmethod
    def get_total_ownership_percentage(property_id: str) -> float:
        """
        Calculate the total ownership percentage for a property.
        
        Args:
            property_id (str): The ID of the property
            
        Returns:
            float: Total ownership percentage (should be 100% if all ownership is accounted for)
        """
        ownerships = list(company_ownership_collection.find({"property_id": property_id}))
        total_percentage = sum(ownership.get("percentage_ownership", 0) for ownership in ownerships)
        return total_percentage

    @staticmethod
    def get_ownerships_by_well_type(well_type: str) -> List[Dict]:
        """
        Get all company ownership records for a specific well type.
        
        Args:
            well_type (str): The well type to search for (e.g., vertical, horizontal, directional)
            
        Returns:
            List[Dict]: List of company ownership records for the specified well type
        """
        return list(company_ownership_collection.find({"well_type": well_type})) 