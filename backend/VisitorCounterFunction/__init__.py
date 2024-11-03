import os
import json
import azure.functions as func
from azure.cosmos import CosmosClient

# Get Cosmos DB credentials from environment variables
COSMOS_DB_ENDPOINT = os.getenv("COSMOS_DB_ENDPOINT")
COSMOS_DB_KEY = os.getenv("COSMOS_DB_KEY")
DATABASE_NAME = "VisitorCounterDB"
CONTAINER_NAME = "VisitorCountContainer"

# Initialize the Cosmos client
client = CosmosClient(COSMOS_DB_ENDPOINT, COSMOS_DB_KEY)
database = client.get_database_client(DATABASE_NAME)
container = database.get_container_client(CONTAINER_NAME)

def main(req: func.HttpRequest) -> func.HttpResponse:
    try:
        # Retrieve the current visitor count from Cosmos DB
        visitor_count_item = container.read_item(item="visitorCounter", partition_key="visitorCounter")
        current_count = visitor_count_item.get("count", 0)

        if req.method == "POST":
            # Increment the visitor count if it's a POST request
            current_count += 1
            visitor_count_item["count"] = current_count
            container.upsert_item(visitor_count_item)  # Update the item in Cosmos DB

        # Return the current visitor count
        return func.HttpResponse(
            json.dumps({"visitor_count": current_count}),
            status_code=200,
            mimetype="application/json"
        )

    except Exception as e:
        # Handle any errors
        return func.HttpResponse(f"Error: {str(e)}", status_code=500)
