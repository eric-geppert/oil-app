from pymongo import MongoClient
from bson import ObjectId
from typing import Dict, List, Optional
from utils import create_document, get_document, get_all_documents, update_document, delete_document
from datetime import datetime

# MongoDB connection
uri = "mongodb+srv://ericgeppert04:Henry4likes2run@cluster0.pls3v.mongodb.net/?retryWrites=true&w=majority"
client = MongoClient(uri)
db = client["db1"]
properties_collection = db["properties"]

class PropertiesAPI:
    @staticmethod
    def create_property(property_data: Dict) -> str:
        """
        Create a new property in the database.
        
        Args:
            property_data (Dict): Property information including:
                - name (str): Property name (MANDATORY)
                - address (Dict): Address information (MANDATORY):
                    - street (str): Street address
                    - city (str): City
                    - state (str): State
                    - zip_code (str): ZIP code
                - created_at (datetime): Creation timestamp
                
        Returns:
            str: The ID of the newly created property
            
        Raises:
            ValueError: If any mandatory field is missing or empty
        """
        # Validate all mandatory fields
        mandatory_fields = ["name", "address"]
        for field in mandatory_fields:
            if field not in property_data or not property_data[field]:
                raise ValueError(f"The '{field}' field is mandatory and cannot be empty")
            
        # Add creation timestamp if not provided
        if "created_at" not in property_data:
            property_data["created_at"] = datetime.now()
            
        return str(create_document(properties_collection, property_data))

    @staticmethod
    def get_property(property_id: str) -> Optional[Dict]:
        """
        Retrieve a property by its ID.
        
        Args:
            property_id (str): The ID of the property to retrieve
            
        Returns:
            Optional[Dict]: The property document if found, None otherwise
        """
        return get_document({"_id": ObjectId(property_id)})

    @staticmethod
    def get_all_properties() -> List[Dict]:
        """
        Retrieve all properties from the database.
        
        Returns:
            List[Dict]: List of all property documents
        """
        return get_all_documents(properties_collection)

    @staticmethod
    def update_property(property_id: str, update_data: Dict) -> int:
        """
        Update a property's information.
        
        Args:
            property_id (str): The ID of the property to update
            update_data (Dict): The fields to update and their new values
            
        Returns:
            int: Number of documents modified (1 if successful, 0 if not found)
        """
        return update_document({"_id": ObjectId(property_id)}, update_data)

    @staticmethod
    def delete_property(property_id: str) -> int:
        """
        Delete a property from the database.
        
        Args:
            property_id (str): The ID of the property to delete
            
        Returns:
            int: Number of documents deleted (1 if successful, 0 if not found)
        """
        return delete_document({"_id": ObjectId(property_id)})

    @staticmethod
    def search_properties(query: Dict) -> List[Dict]:
        """
        Search for properties based on specific criteria.
        
        Args:
            query (Dict): Search criteria (e.g., {"name": {"$regex": "search_term", "$options": "i"}})
            
        Returns:
            List[Dict]: List of matching property documents
        """
        return list(properties_collection.find(query))
        
    @staticmethod
    def update_address(property_id: str, address_data: Dict) -> int:
        """
        Update the address of a property.
        
        Args:
            property_id (str): The ID of the property
            address_data (Dict): Address information with fields:
                - street (str): Street address
                - city (str): City
                - state (str): State
                - zip_code (str): ZIP code
                
        Returns:
            int: Number of documents modified (1 if successful, 0 if not found)
        """
        return update_document(
            {"_id": ObjectId(property_id)},
            {"$set": {"address": address_data}}
        )
        
    @staticmethod
    def get_properties_by_state(state: str) -> List[Dict]:
        """
        Get all properties in a specific state.
        
        Args:
            state (str): The state to search for
            
        Returns:
            List[Dict]: List of properties in the specified state
        """
        return list(properties_collection.find({
            "address.state": {"$regex": f"^{state}$", "$options": "i"}
        })) 