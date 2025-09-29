import json

# Load the notebook
with open("NLP Project/Code/Project/nlpporjectfastapi.ipynb", "r") as f:
    nb = json.load(f)

# Find the cell with the upload function
for cell in nb['cells']:
    if cell['cell_type'] == 'code':
        source = ''.join(cell['source'])
        if '@app.post("/upload")' in source:
            # Modify the source
            new_source = source.replace(
                'async def upload_file(file: UploadFile = File(...)):',
                'async def upload_file(files: List[UploadFile] = File(...)):'
            )
            # Replace the try block
            old_try = '''    try:
        # Save the uploaded file
        file_location = f"{drive_path}/static/uploads/{file.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)

        is_video = file.filename.lower().endswith(('.mp4', '.avi', '.mov'))

        # Process the file
        caption = caption_image(file_location) if not is_video else None
        objects = detect_objects(file_location) if not is_video else None

        return {
            "filename": file.filename,
            "filepath": f"/static/uploads/{file.filename}",
            "is_video": is_video,
            "caption": caption,
            "objects": objects
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))'''
            new_try = '''    try:
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
        raise HTTPException(status_code=500, detail=str(e))'''
            new_source = new_source.replace(old_try, new_try)
            cell['source'] = new_source.split('\n')
            break

# Save the notebook
with open("NLP Project/Code/Project/nlpporjectfastapi.ipynb", "w") as f:
    json.dump(nb, f, indent=1)
