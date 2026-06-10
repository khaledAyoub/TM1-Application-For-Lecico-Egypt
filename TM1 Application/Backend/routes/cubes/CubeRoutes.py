from config import connections
from fastapi import APIRouter, HTTPException, Cookie, Request
import pandas as pd
import json
CubeRoutes = APIRouter()

from fastapi import APIRouter, HTTPException, Cookie
from helper.TM1Controller import getData,setData


@CubeRoutes.post("/cube/query")
async def excuteMDX(
    request: Request,
    access_token: str = Cookie(None)
):
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token is missing.")

    if access_token not in connections:
        raise HTTPException(status_code=401, detail="Invalid access token.")


    raw_body = await request.body()
    raw_str = raw_body.decode("utf-8")


    try:
        data = json.loads(raw_str)
        
    except json.JSONDecodeError:
        try:
            data = json.loads(json.loads(raw_str))
        except Exception:
            raise HTTPException(status_code=400, detail=f"Cannot parse body: {raw_str[:100]}")
    
    connection = connections[access_token]
    mdx = data.get("mdx")
    if mdx == None:
        raise HTTPException(status_code=400, detail=f"MDX is None")

    dimensions,dataJson = getData(connection , mdx)
    return { "authenticated":True, "dimensions" : dimensions , "view" : dataJson}



@CubeRoutes.put("/cube/query")
async def excuteMDX(
    request: Request,
    access_token: str = Cookie(None)
):
    if not access_token:
        raise HTTPException(status_code=401, detail="Access token is missing.")

    if access_token not in connections:
        raise HTTPException(status_code=401, detail="Invalid access token.")


    raw_body = await request.body()
    raw_str = raw_body.decode("utf-8")


    try:
        data = json.loads(raw_str)
        
    except json.JSONDecodeError:
        try:
            data = json.loads(json.loads(raw_str))
        except Exception:
            raise HTTPException(status_code=400, detail=f"Cannot parse body: {raw_str[:100]}")
    
    connection = connections[access_token]
    mdx = data.get("mdx")
    jsonData = data.get("updatedData")
    if mdx == None or jsonData==None:
        raise HTTPException(status_code=400, detail=f"MDX or jsonData is empty")

    status ,cubeName = setData(connection , mdx ,jsonData)

    return { "status" : status , "cubeName" : cubeName}
