from urllib import response

from dotenv import load_dotenv
import os
from fastapi import APIRouter, Cookie, Header, HTTPException
from fastapi.responses import JSONResponse
from fastapi import Cookie, HTTPException

from TM1py.Services import TM1Service
from helper.jwt import create_access_token, verify_access_token
from config import connections

load_dotenv()

TM1_HOST = os.getenv("TM1_HOST")
TM1_PORT = os.getenv("TM1_PORT")
TM1_SSL = os.getenv("TM1_SSL") == "True"
TM1_USER = os.getenv("TM1_USER")         
TM1_PASSWORD = os.getenv("TM1_PASSWORD")  
LOGFOLDER = os.getenv("LOGFOLDER", "./logs")


authrouter = APIRouter()


@authrouter.post("/login")
async def login(data: dict):
    if not data:
        raise HTTPException(status_code=400, detail="No data provided.")

    if "username" not in data or "password" not in data:
        raise HTTPException(status_code=400, detail="Username and password are required.")
    
    if data["username"] != "test" or data["password"] != "test":
        return JSONResponse({"authenticated": False})

    username = data.get("username")
    password = data.get("password")

    try:
        connection = TM1Service(address=TM1_HOST, port=int(TM1_PORT), ssl=TM1_SSL, user=TM1_USER, password=TM1_PASSWORD)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to connect to TM1: {str(e)}")

    token = create_access_token(data={"name": username , "password": password})
    
    connections[token] = connection


    response = JSONResponse({"authenticated": True})

    response.set_cookie(
    key="access_token",
    value=token,
    httponly=True,
    secure=False, 
    samesite="lax"
)

    return response


@authrouter.post("/logout")
async def logout(access_token: str = Cookie(None)):
    response = JSONResponse({
            "authenticated": False
        })
    
    if not access_token:
        return response
    
    if access_token in connections:
        connection = connections.pop(access_token)
        connection.logout()

    

    response.delete_cookie(
        key="access_token",
        path="/"
    )
    return response


@authrouter.get("/checkauth")
async def checkauth(access_token: str = Cookie(None)):
    if not access_token:
        return {"authenticated": False}

    return {
            "authenticated": True,
    }