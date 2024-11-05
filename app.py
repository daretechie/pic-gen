from flask import Flask, render_template, request, jsonify
import requests
import os
from dotenv import load_dotenv

# Load environment variables from a .env file
load_dotenv()

app = Flask(__name__)

# Unsplash API key from the environment file
UNSPLASH_API_KEY = os.getenv('UNSPLASH_API_KEY')

@app.route('/')
def home():
    # Show the main web page
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate_images():
    # Get the "prompt" (search term) from the request
    prompt = request.json.get('prompt')

    if not prompt:
        return jsonify({'error': 'No prompt provided'}), 400

    try:
        # Send a request to Unsplash API to get random images matching the prompt
        response = requests.get(
            'https://api.unsplash.com/photos/random',
            params={
                'query': prompt,           # search term from the user
                'count': 4,                # number of images to return
                'client_id': UNSPLASH_API_KEY  # API key
            }
        )

        if response.status_code != 200:
            return jsonify({'error': 'Failed to fetch images'}), response.status_code

        # Process the images received from the API
        images = []
        for img in response.json():
            images.append({
                'url': img['urls']['regular'],           # Image URL
                'download_url': img['links']['download'], # Direct download link
                # 'photographer': img['user']['name'],      # Photographer's name
                # 'photographer_url': img['user']['links']['html'] # Photographer's profile link
            })

        return jsonify({'images': images})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Start the Flask server
if __name__ == '__main__':
    app.run(debug=True)
