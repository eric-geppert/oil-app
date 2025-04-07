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
            ownership_data (Dict): Ownership information including:
                - company_id (str): ID of the company (MANDATORY)
                - property_id (str): ID of the property (MANDATORY)
                - interest_type (str): Type of interest (e.g., royalty, working) (MANDATORY)
                - percentage (float): Percentage of ownership (MANDATORY)
                - is_current_owner (bool): Whether the company is the current owner (MANDATORY)
                - date_from (datetime): Start date of ownership (MANDATORY)
                - date_to (datetime, optional): End date of ownership (None if is_current_owner is True else MANDATORY)
                - well_type (str, optional): Type of well (e.g., vertical, horizontal, directional)
                - created_at (datetime): Creation timestamp
                
        Returns:
            str: The ID of the newly created ownership record
            
        Raises:
            ValueError: If required fields are missing or if company_id/property_id don't exist
        """
        # Validate required fields
        required_fields = ["company_id", "property_id", "interest_type", "percentage", "is_current_owner", "date_from"]
        for field in required_fields:
            if field not in ownership_data:
                raise ValueError(f"The '{field}' field is mandatory and cannot be empty")
        
        # Validate that company_id exists in the companies collection
        company_id = ownership_data["company_id"]
        company_exists = companies_collection.find_one({"_id": ObjectId(company_id)})
        if not company_exists:
            raise ValueError(f"Company with ID '{company_id}' does not exist in the database")
        
        # Validate that property_id exists in the properties collection
        property_id = ownership_data["property_id"]
        property_exists = properties_collection.find_one({"_id": ObjectId(property_id)})
        if not property_exists:
            raise ValueError(f"Property with ID '{property_id}' does not exist in the database")
        
        # Validate percentage is between 0 and 100
        percentage = ownership_data["percentage"]
        if not (0 <= percentage <= 100):
            raise ValueError("Percentage must be between 0 and 100")
            
        # Validate date_to is None if is_current_owner is True
        is_current_owner = ownership_data["is_current_owner"]
        if is_current_owner:
            if "date_to" in ownership_data and ownership_data["date_to"] is not None:
                raise ValueError("date_to must be None when is_current_owner is True")
        else:
            # date_to is mandatory when is_current_owner is False
            if "date_to" not in ownership_data or ownership_data["date_to"] is None:
                raise ValueError("date_to is mandatory when is_current_owner is False")
            
        # Validate date_to is on or after date_from if provided
        if "date_to" in ownership_data and ownership_data["date_to"] is not None:
            date_from = ownership_data["date_from"]
            date_to = ownership_data["date_to"]
            if date_to <= date_from:
                raise ValueError("date_to must be after date_from")
        
        # Add creation timestamp if not provided
        if "created_at" not in ownership_data:
            ownership_data["created_at"] = datetime.now()
            
        return str(create_document(company_ownership_collection, ownership_data))

    @staticmethod
    def get_company_ownership(ownership_id: str) -> Optional[Dict]:
        """
        Retrieve a company ownership record by its ID.
        
        Args:
            ownership_id (str): The ID of the ownership record to retrieve
            
        Returns:
            Optional[Dict]: The ownership document if found, None otherwise
        """
        return get_document({"_id": ObjectId(ownership_id)})

    @staticmethod
    def get_all_company_ownerships() -> List[Dict]:
        """
        Retrieve all company ownership records from the database.
        
        Returns:
            List[Dict]: List of all ownership documents
        """
        return get_all_documents(company_ownership_collection)

    @staticmethod
    def update_company_ownership(ownership_id: str, update_data: Dict) -> int:
        """
        Update a company ownership record's information.
        
        Args:
            ownership_id (str): The ID of the ownership record to update
            update_data (Dict): The fields to update and their new values
            
        Returns:
            int: Number of documents modified (1 if successful, 0 if not found)
        """
        # Validate percentage is between 0 and 100 if it's being updated
        if "percentage" in update_data:
            percentage = update_data["percentage"]
            if not (0 <= percentage <= 100):
                raise ValueError("Percentage must be between 0 and 100")
                
        # Validate date_to is None if is_current_owner is True
        if "is_current_owner" in update_data:
            is_current_owner = update_data["is_current_owner"]
            if is_current_owner:
                if "date_to" in update_data and update_data["date_to"] is not None:
                    raise ValueError("date_to must be None when is_current_owner is True")
            else:
                # date_to is mandatory when is_current_owner is False
                if "date_to" in update_data and update_data["date_to"] is None:
                    raise ValueError("date_to is mandatory when is_current_owner is False")
                
        # Validate date_to is after date_from if both are being updated
        if "date_to" in update_data and update_data["date_to"] is not None and "date_from" in update_data:
            date_from = update_data["date_from"]
            date_to = update_data["date_to"]
            if date_to < date_from:
                raise ValueError("date_to must be after date_from")
                
        return update_document({"_id": ObjectId(ownership_id)}, update_data)

    @staticmethod
    def delete_company_ownership(ownership_id: str) -> int:
        """
        Delete a company ownership record from the database.
        
        Args:
            ownership_id (str): The ID of the ownership record to delete
            
        Returns:
            int: Number of documents deleted (1 if successful, 0 if not found)
        """
        return delete_document({"_id": ObjectId(ownership_id)})

    @staticmethod
    def search_company_ownerships(query: Dict) -> List[Dict]:
        """
        Search for company ownership records based on specific criteria.
        
        Args:
            query (Dict): Search criteria (e.g., {"interest_type": "royalty"})
            
        Returns:
            List[Dict]: List of matching ownership documents
        """
        return list(company_ownership_collection.find(query))
        
    @staticmethod
    def get_ownerships_by_property(property_id: str) -> List[Dict]:
        """
        Get all ownership records for a specific property.
        
        Args:
            property_id (str): The ID of the property
            
        Returns:
            List[Dict]: List of ownership records for the specified property
        """
        return list(company_ownership_collection.find({"property_id": property_id}))
        
    @staticmethod
    def get_ownerships_by_company(company_id: str) -> List[Dict]:
        """
        Get all ownership records for a specific company.
        
        Args:
            company_id (str): The ID of the company
            
        Returns:
            List[Dict]: List of ownership records for the specified company
        """
        return list(company_ownership_collection.find({"company_id": company_id}))
        
    @staticmethod
    def get_ownerships_by_interest_type(interest_type: str) -> List[Dict]:
        """
        Get all ownership records of a specific interest type.
        
        Args:
            interest_type (str): The interest type to search for
            
        Returns:
            List[Dict]: List of ownership records with the specified interest type
        """
        return list(company_ownership_collection.find({"interest_type": interest_type}))
        
    @staticmethod
    def get_ownerships_by_percentage_range(min_percentage: float, max_percentage: float) -> List[Dict]:
        """
        Get all ownership records within a percentage range.
        
        Args:
            min_percentage (float): Minimum percentage
            max_percentage (float): Maximum percentage
            
        Returns:
            List[Dict]: List of ownership records within the specified percentage range
        """
        return list(company_ownership_collection.find({
            "percentage": {
                "$gte": min_percentage,
                "$lte": max_percentage
            }
        }))
        
    @staticmethod
    def get_ownerships_by_well_type(well_type: str) -> List[Dict]:
        """
        Get all ownership records for a specific well type.
        
        Args:
            well_type (str): The well type to search for
            
        Returns:
            List[Dict]: List of ownership records with the specified well type
        """
        return list(company_ownership_collection.find({"well_type": well_type}))
        
    @staticmethod
    def get_current_ownerships() -> List[Dict]:
        """
        Get all current ownership records (where is_current_owner is True).
        
        Returns:
            List[Dict]: List of current ownership records
        """
        return list(company_ownership_collection.find({"is_current_owner": True}))
        
    @staticmethod
    def get_historical_ownerships() -> List[Dict]:
        """
        Get all historical ownership records (where is_current_owner is False).
        
        Returns:
            List[Dict]: List of historical ownership records
        """
        return list(company_ownership_collection.find({"is_current_owner": False}))
        
    @staticmethod
    def get_ownerships_by_date_range(start_date: datetime, end_date: datetime) -> List[Dict]:
        """
        Get all ownership records active within a date range.
        
        Args:
            start_date (datetime): Start of the date range
            end_date (datetime): End of the date range
            
        Returns:
            List[Dict]: List of ownership records active within the specified date range
        """
        return list(company_ownership_collection.find({
            "$or": [
                # Current ownerships
                {"is_current_owner": True, "date_from": {"$lte": end_date}},
                # Historical ownerships that overlap with the date range
                {
                    "is_current_owner": False,
                    "date_from": {"$lte": end_date},
                    "date_to": {"$gte": start_date}
                }
            ]
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
        total_percentage = sum(ownership.get("percentage", 0) for ownership in ownerships)
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