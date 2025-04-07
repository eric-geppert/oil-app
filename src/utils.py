# Create (Insert)
def create_document(collection,data):
    print("creating doc")
    result = collection.insert_one(data)
    return result.inserted_id

# Read (Retrieve)
def get_document(query):
    doc = collection.find_one(query)
    if doc:
        doc['_id'] = str(doc['_id'])
    return doc

def get_all_documents(collection):
    print("alll stuffs")
    documents = list(collection.find())
    # Convert ObjectId to string for each document
    for doc in documents:
        doc['_id'] = str(doc['_id'])
    return documents

# Update
def update_document(query, data):
    result = collection.update_one(query, {"$set": data})
    return result.modified_count

# Delete
def delete_document(query):
    result = collection.delete_one(query)
    return result.deleted_count