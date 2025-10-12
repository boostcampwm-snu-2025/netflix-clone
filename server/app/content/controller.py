import asyncio
from fastapi import APIRouter, Query
import json
import os

content_router = APIRouter()

@content_router.get("/")
async def get_home_items():
    await asyncio.sleep(1)
    with open("server/data.json", 'r') as f:
        items = json.load(f)
    return items

@content_router.get("/search")
async def get_search_items(
    q: str = Query(None)
):
    await asyncio.sleep(1)
    with open("server/content.json", 'r') as f:
        items = json.load(f)

    if q:
        q_lower = q.lower()
        filtered_items = [ item for item in items if q_lower in item['name'].lower() ]
        return filtered_items
    
    return items