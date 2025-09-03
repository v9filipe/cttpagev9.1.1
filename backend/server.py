import os
import uuid
import logging
from datetime import datetime
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient
import uvicorn
from pymongo.errors import ConnectionFailure

# Import routes and services
from ctt_routes import router as ctt_router
from telegram_service import TelegramService
from console_service import ConsoleService

# Load environment variables first
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Initialize services
telegram_service = None
console_service = ConsoleService()

app = FastAPI(title="CTT Expresso API", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "CTT Expresso API is running"}

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test database connection
        await db.admin.command('ping')
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"
    
    # Check Telegram configuration
    telegram_configured = bool(
        os.environ.get('TELEGRAM_BOT_TOKEN') and 
        os.environ.get('TELEGRAM_CHAT_ID')
    )
    
    return {
        "status": "healthy",
        "database": db_status,
        "telegram_configured": telegram_configured,
        "timestamp": datetime.now().isoformat()
    }

# Global variables for database and services
db = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    global db, telegram_service
    
    # Startup
    logger.info("CTT Expresso API starting up...")
    
    try:
        # Initialize MongoDB
        mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
        db_name = os.environ.get('DB_NAME', 'ctt_clone')
        
        client = AsyncIOMotorClient(mongo_url)
        db = client[db_name]
        
        # Test connection
        await client.admin.command('ping')
        logger.info(f"Connected to MongoDB: {db_name}")
        
        # Initialize Telegram service
        telegram_service = TelegramService()
        logger.info("Telegram service initialized")
        
        # Store services in app state for access in routes
        app.state.db = db
        app.state.telegram_service = telegram_service
        app.state.console_service = console_service
        
    except Exception as e:
        logger.error(f"Failed to initialize services: {e}")
        raise
    
    yield
    
    # Shutdown
    logger.info("CTT Expresso API shutting down...")
    if hasattr(client, 'close'):
        client.close()

# Update app with lifespan
app.router.lifespan_context = lifespan

# Include routers
app.include_router(ctt_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run("server:app", host="0.0.0.0", port=8001, reload=True)