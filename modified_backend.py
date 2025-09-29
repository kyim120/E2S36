# Modified backend code for multiple images

from fastapi import FastAPI, UploadFile, File, Request, HTTPException

from fastapi.staticfiles import StaticFiles

from fastapi.templating import Jinja2Templates

from fastapi.responses import HTMLResponse, JSONResponse, FileResponse

from fastapi.middleware.cors import CORSMiddleware

import torch

import requests

import cv2

from PIL import Image

from transformers import BlipProcessor, BlipForConditionalGeneration

from ultralytics import YOLO

from deepface import DeepFace

import numpy as np

import time

import collections

import os

import uvicorn

from pyngrok import ngrok

import nest_asyncio

import shutil

from pathlib import Path

from typing import List

# Initialize FastAPI app

app = FastAPI()

# Allow CORS for frontend development

app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],

)

# Mount static files from Google Drive

drive_path = "/content/drive/MyDrive/Project"

app.mount("/static", StaticFiles(directory=f"{drive_path}/static"), name="static")

templates = Jinja2Templates(directory=drive_path)

# 🔑 Replace with your OpenRouter API Key

API_KEY = "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"

# ✅ Global Model Initialization

blip_processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")

blip_model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base", torch_dtype=torch.float16)

blip_device = "cuda" if torch.cuda.is_available() else "cpu"

blip_model.to(blip_device)

yolo_model_large = YOLO("yolov8n.pt")

yolo_model_small = YOLO("yolov8n.pt")

# Create uploads directory if not exists

os.makedirs(f"{drive_path}/static/uploads", exist_ok=True)

# ... (other functions remain the same)

# API Endpoints

@app.post("/upload")

async def upload_file(files: List[UploadFile] = File(...)):

    try:

        results = []

        for file in files:

            # Save the uploaded file

            file_location = f"{drive_path}/static/uploads/{file.filename}"

            with open(file_location, "wb+") as file_object:

                shutil.copyfileobj(file.file, file_object)

            is_video = file.filename.lower().endswith(('.mp4', '.avi', '.mov'))

            # Process the file

            caption = caption_image(file_location) if not is_video else None

            objects = detect_objects(file_location) if not is_video else None

            results.append({

                "filename": file.filename,

                "filepath": f"/static/uploads/{file.filename}",

                "is_video": is_video,

                "caption": caption,

                "objects": objects

            })

        return results

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))

# ... (rest of the code remains the same)
