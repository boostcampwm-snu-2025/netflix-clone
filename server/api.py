from fastapi import APIRouter
from server.app.content.controller import content_router

api_router = APIRouter()

api_router.include_router(content_router, prefix="/content", tags=["content"])