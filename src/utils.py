# Create (Insert)
def create_document(collection,data):
    print("creating doc")
    result = collection.insert_one(data)
    return result.inserted_id

# Read (Retrieve)
def get_document(query):
    return collection.find_one(query)

def get_all_documents(collection):
    print("alll stuffs")
    variable1 = collection.find()
    for document in variable1:
        print(document) 
    # for obj in vars(variable1).items():
    #     print("obj:", obj)
    # for key, value in vars(variable1).items():
    #     print(f"{key}: {value}")
    return list(collection.find())

# Update
def update_document(query, data):
    result = collection.update_one(query, {"$set": data})
    return result.modified_count

# Delete
def delete_document(query):
    result = collection.delete_one(query)
    return result.deleted_count