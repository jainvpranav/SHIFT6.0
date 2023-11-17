from flask import Flask, render_template, request, jsonify
from flask_cors import CORS 
from google.oauth2 import service_account
import google.auth.transport.requests
from PIL import Image
from io import BytesIO
import base64
import json
import requests
import time
import uuid

app = Flask(__name__, template_folder='templates')
CORS(app) 
# specify the scopes
SCOPES = ['https://www.googleapis.com/auth/cloud-platform']

# Load the credentials from the service account file
credentials = service_account.Credentials.from_service_account_file(
    'tokyo-hold-404113-940ca9971c6c.json', scopes=SCOPES)

# Create a requests Session object with the credentials
authed_session = google.auth.transport.requests.AuthorizedSession(credentials)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate_images', methods=['POST'])
def generate_images():
    try:
        # Get text prompt from the request
        text_prompt = request.json.get('textPrompt', '')
        print(f"Received text prompt: {text_prompt}")
        # Prepare the request body
        data = {
            "instances": [
                {"prompt": text_prompt}
            ],
            "parameters": {
                "sampleCount": 3
            }
        }

        # Send the request
        response = authed_session.post(
            f"https://us-central1-aiplatform.googleapis.com/v1/projects/tokyo-hold-404113/locations/us-central1/publishers/google/models/imagegeneration:predict",
            json=data
        )

        # Parse the response
        response_data = response.json()
        predictions = response_data.get('predictions', [])

        # Save the generated images
        # for i, prediction in enumerate(predictions):
        #     img_bytes = base64.b64decode(prediction['bytesBase64Encoded'])
        #     img = Image.open(BytesIO(img_bytes))
        #     img.save(f"static/output_{i+1}.png")
        image_filenames = []
        for i, prediction in enumerate(predictions):
            timestamp = int(time.time())
            unique_id = str(uuid.uuid4())[:8]
            filename = f"static/output_{timestamp}_{unique_id}.png"

            img_bytes = base64.b64decode(prediction['bytesBase64Encoded'])
            img = Image.open(BytesIO(img_bytes))
            img.save(filename)

            # Append the filename to the list
            image_filenames.append(filename)
        print(image_filenames)
        return jsonify({"success": True, "image_filenames": image_filenames})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

if __name__ == '__main__':
    app.run(debug=True)
