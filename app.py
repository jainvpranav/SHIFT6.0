from flask import Flask, redirect, render_template, request, jsonify, url_for
from flask_cors import CORS 
from google.oauth2 import service_account
import google.auth.transport.requests
from PIL import Image
from io import BytesIO
import base64

app = Flask(__name__, template_folder='templates', static_url_path='/static')
CORS(app) 
# specify the scopes
SCOPES = ['https://www.googleapis.com/auth/cloud-platform']

# Load the credentials from the service account file
credentials = service_account.Credentials.from_service_account_file(
    'dataset.json', scopes=SCOPES)

# Create a requests Session object with the credentials
authed_session = google.auth.transport.requests.AuthorizedSession(credentials)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/changePage', methods=['GET', 'POST'])
def changePage():
    return render_template('index1.html')
    
@app.route('/generate_images', methods=['POST'])
def generate_images():
    try:
        # Get text prompt from the request
        text_prompt = request.json.get('textPrompt', '')
        # Prepare the request body
        data = {
            "instances": [
                {"prompt": text_prompt}
            ],  
            "parameters": {
                "sampleCount": 3,
                "temperature": 1.0,
                "maxOutputTokens": 256,
                "topK": 90,
                "topP": 0.99
            }
        }

        # Send the request
        response = authed_session.post(
            f"https://us-central1-aiplatform.googleapis.com/v1/projects/shift-405505/locations/us-central1/publishers/google/models/imagegeneration:predict",
            json=data
        )

        # Parse the response
        response_data = response.json()
        predictions = response_data.get('predictions', [])
        image_filenames = []
        for i, prediction in enumerate(predictions):
            try:
                with open('static/genai.txt', 'r') as file:
                    curr = int(file.read().strip())
                    print(curr)
            except FileNotFoundError:
                print('error')
            newcurr = curr+1
            filename = f"static/gen_images/{newcurr}.png"
            with open('static/genai.txt', 'w') as file1:
                file1.write(str(newcurr))
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
