from google.oauth2 import service_account
import google.auth.transport.requests
import requests
import base64
from PIL import Image
from io import BytesIO
import json

# specify the scopes
SCOPES = ['https://www.googleapis.com/auth/cloud-platform']


# Load the credentials from the service account file
credentials = service_account.Credentials.from_service_account_file('tokyo-hold-404113-940ca9971c6c.json', scopes=SCOPES)

# Create a requests Session object with the credentials
authed_session = google.auth.transport.requests.AuthorizedSession(credentials)

# Set your project ID, text prompt, and image count
TEXT_PROMPT = 'Etnic kurtas for Indian wedding in pastel colors for women.'
IMAGE_COUNT = 1  # any integer from 1 to 8

# Prepare the request body
data = {
  "instances": [
    {
      "prompt": TEXT_PROMPT
    }
  ],
  "parameters": {
    "sampleCount": IMAGE_COUNT
  }
}

# Send the request
response = authed_session.post(
    f"https://us-central1-aiplatform.googleapis.com/v1/projects/tokyo-hold-404113/locations/us-central1/publishers/google/models/imagegeneration:predict",
    json=data
)

# Parse the response
response_data = response.json()
# print(response_data)
predictions = response_data.get('predictions', [])

# Save the generated images
for i, prediction in enumerate(predictions):
    img_bytes = base64.b64decode(prediction['bytesBase64Encoded'])
    img = Image.open(BytesIO(img_bytes))
    img.save(f"output_{i+1}.png")
