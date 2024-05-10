# Libraries for FastAPI
from fastapi import FastAPI, Query, Path, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse, Response,  FileResponse
from motor.motor_asyncio import AsyncIOMotorClient
from mongoManager import MongoManager
from pydantic import BaseModel
from pymongo import MongoClient
from typing import List
import random
import base64
import json
import uvicorn
import os
from random import shuffle
from passlib.context import CryptContext
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# MongoDB connection setup
MONGODB_URL = "mongodb://137.184.227.11:27017/candy_store_2"

async def connect_to_mongodb():
    client = AsyncIOMotorClient(MONGODB_URL)
    return client

# Define the Candy model
class Candy(BaseModel):
    _id: int
    id: str
    name: str
    prod_url: str
    img_url: str
    price: float
    desc: str
    categorys: List[int]
    img_path: str

class Category(BaseModel):
    _id: int
    count: int
    name: str
    candies: List[int]

# Get candy names from the database
async def get_candy_names(query: str):
    mongodb_client = await connect_to_mongodb()
    db = mongodb_client["candy_store_2"]
    candies_collection = db["candies"]
    cursor = candies_collection.find({"name": {"$regex": query, "$options": "i"}}, {"name": 1}).limit(10)
    candy_names = [candy["name"] async for candy in cursor]
    return candy_names

@app.get("/autocomplete", response_model=List[str])
async def autocomplete(query: str = Query(..., min_length=1)):
    suggestions = await get_candy_names(query)
    return suggestions
@app.get("/candies/random", response_model=List[Candy])
async def get_random_candies(mongodb_client: AsyncIOMotorClient = Depends(connect_to_mongodb)):
    db = mongodb_client["candy_store_2"]
    candies_collection = db["candies"]
    # Get the total count of candies in the database
    total_candies = await candies_collection.count_documents({})
    # Define the number of random candies you want to retrieve
    num_random_candies = 5  # You can change this number as needed
    # Generate a list of random indices to select candies
    random_indices = random.sample(range(total_candies), num_random_candies)
    # Fetch candies using the random indices
    random_candies = await candies_collection.find().limit(num_random_candies).skip(random.randint(0, total_candies)).to_list(length=None)    return random_candies


# Create a candy
@app.post("/candies", response_model=Candy)
async def create_candy(candy: Candy, mongodb_client: AsyncIOMotorClient = Depends(connect_to_mongodb)):
    db = mongodb_client["candy_store_2"]
    candies_collection = db["candies"]
    await candies_collection.insert_one(candy.dict())
    return candy


# API endpoint to retrieve candies by category name
@app.get("/candies/category/{category_name}", response_model=List[Candy])
async def get_candies_by_category(category_name: str, mongodb_client: AsyncIOMotorClient = Depends(connect_to_mongodb)):
    # Use the provided MongoDB client to access the database
    db = mongodb_client["candy_store_2"]

    # Query the categories collection to find the category document
    category_doc = await db["categories"].find_one({"name": category_name})
    if not category_doc:
        raise HTTPException(status_code=404, detail="Category not found")

    # Get the list of candy IDs associated with the category
    candy_ids = category_doc.get("candies", [])

    # Query the candies collection to find candies with matching IDs in categorys array
    candies = await db["candies"].find({"_id": {"$in": candy_ids}}).to_list(length=None)

    return candies

# Retrieve a candy by name
@app.get("/candies/name/{candy_name}", response_model=Candy)
async def get_candy_by_name(candy_name: str, mongodb_client: AsyncIOMotorClient = Depends(connect_to_mongodb)):
    db = mongodb_client["candy_store_2"]
    candies_collection = db["candies"]
    candy = await candies_collection.find_one({"name": candy_name})
    if candy:
        return candy
    else:
        raise HTTPException(status_code=404, detail="Candy not found")

# Retrieve all candies
@app.get("/candies", response_model=List[Candy])
async def get_all_candies(mongodb_client: AsyncIOMotorClient = Depends(connect_to_mongodb)):
    db = mongodb_client["candy_store_2"]
    candies_collection = db["candies"]
    candies = await candies_collection.find({}).to_list(length=None)
    return candies

# Retrieve a candy by ID
@app.get("/candies/{candy_id}", response_model=Candy)
async def get_candy_by_id(candy_id: str, mongodb_client: AsyncIOMotorClient = Depends(connect_to_mongodb)):
    db = mongodb_client["candy_store_2"]
    candies_collection = db["candies"]
    candy = await candies_collection.find_one({"_id": int(candy_id)})
    if candy:
        return candy
    else:
        raise HTTPException(status_code=404, detail="Candy not found")

@app.get("/candies/by_id/{candy_id}", response_model=Candy)
async def get_candy_by_alt_id(candy_id: str, mongodb_client: AsyncIOMotorClient = Depends(connect_to_mongodb)):
    db = mongodb_client["candy_store_2"]
    candies_collection = db["candies"]
    candy = await candies_collection.find_one({"id": candy_id})
    if candy:
        return candy
    else:
        raise HTTPException(status_code=404, detail="Candy not found")

# Update a candy by ID
@app.put("/candies/{candy_id}", response_model=Candy)
async def update_candy(candy_id: str, candy: Candy, mongodb_client: AsyncIOMotorClient = Depends(connect_to_mongodb)):
    db = mongodb_client["candy_store_2"]
    candies_collection = db["candies"]
    result = await candies_collection.update_one({"_id": int(candy_id)}, {"$set": candy.dict()})
    if result.modified_count == 1:
        return candy
    else:
        raise HTTPException(status_code=404, detail="Candy not found")

# Delete a candy by ID
@app.delete("/candies/{candy_id}")
async def delete_candy(candy_id: str, mongodb_client: AsyncIOMotorClient = Depends(connect_to_mongodb)):
    db = mongodb_client["candy_store_2"]
    candies_collection = db["candies"]
    result = await candies_collection.delete_one({"_id": int(candy_id)})
    if result.deleted_count == 1:
        return {"message": "Candy deleted successfully"}
    else:
        raise HTTPException(status_code=404, detail="Candy not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="137.184.227.11", port=8082)