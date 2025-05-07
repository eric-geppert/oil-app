from bson import ObjectId

# Create (Insert)
def create_document(collection, data):
    print("creating doc")
    result = collection.insert_one(data)
    return result.inserted_id

# todo: later remove objectId's from nested fields to keep this efficient, thought there wasn't any?
def convert_objectid_to_str(obj):
    """Convert all ObjectId fields in a document to strings, including nested fields."""
    if isinstance(obj, dict):
        for key, value in obj.items():
            if isinstance(value, ObjectId):
                obj[key] = str(value)
            elif isinstance(value, (dict, list)):
                obj[key] = convert_objectid_to_str(value)
    elif isinstance(obj, list):
        for i, item in enumerate(obj):
            if isinstance(item, (dict, list)):
                obj[i] = convert_objectid_to_str(item)
    return obj

# Read (Retrieve)
def get_document(collection, query):
    """Get a single document from a collection and convert ObjectIds to strings."""
    doc = collection.find_one(query)
    if doc:
        return convert_objectid_to_str(doc)
    return doc

def get_all_documents(collection):
    """Get all documents from a collection and convert ObjectIds to strings."""
    documents = list(collection.find())
    return [convert_objectid_to_str(doc) for doc in documents]

# Update
def update_document(collection, query, data):
    result = collection.update_one(query, {"$set": data})
    return result.modified_count

# Delete
def delete_document(collection, query):
    result = collection.delete_one(query)
    return result.deleted_count