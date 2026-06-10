from dotenv import load_dotenv
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes.authRoutes import authrouter
from routes.TM1py_data_entry_test import TM1pyDataEntryTest
from routes.cubes.CubeRoutes import CubeRoutes


load_dotenv()

SERVER_HOST = os.getenv("SERVER_HOST")
SERVER_PORT = os.getenv("SERVER_PORT")

origins = [
    "http://localhost:5173",
]

if not SERVER_HOST:
    raise ValueError("SERVER_HOST environment variable is not set.")
if not SERVER_PORT:
    raise ValueError("SERVER_PORT environment variable is not set.")
print(f"Server running on {SERVER_HOST}:{SERVER_PORT}")


app = FastAPI()



app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


TM1_HOST = os.getenv("TM1_HOST")
TM1_PORT = os.getenv("TM1_PORT")
TM1_SSL = os.getenv("TM1_SSL") == "True"
TM1_USER = os.getenv("TM1_USER")         
TM1_PASSWORD = os.getenv("TM1_PASSWORD")  
LOGFOLDER = os.getenv("LOGFOLDER", "./logs")

connections = {} 

@app.get("/health")
async def health():
    return {"status": "ok", "host": TM1_HOST, "port": TM1_PORT, "ssl": TM1_SSL,"connections": len(connections)}

app.include_router(authrouter, prefix="/api/v1/auth")
# app.include_router(TM1pyDataEntryTest, prefix="/api/v1/cube")
app.include_router(CubeRoutes, prefix="/api/v1")


if __name__ == "__main__":
    uvicorn.run("Server:app", host=SERVER_HOST, port=int(SERVER_PORT), reload=True)
