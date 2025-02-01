from flask import Flask, request, jsonify, render_template
import requests
from flask_cors import CORS

app = Flask(__name__, static_url_path='/static')
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        data = request.json
        prompt = data.get('prompt', '').strip()
        print(f"Received prompt: {prompt}")
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        response = requests.post('http://localhost:11434/api/generate', json={
            'model': '',  # Add your preferred Ollama model here (e.g., 'DeepSeek R1', 'llama2')
            'prompt': prompt,
            'stream': False
        })
        
        print(f"Response status: {response.status_code}")
        
        if response.status_code != 200:
            return jsonify({'error': f'API error: {response.text}'}), response.status_code
        
        result = response.json()
        return jsonify({'response': result.get('response', '')})
    
    except requests.exceptions.ConnectionError:
        print("Connection error")
        return jsonify({'error': 'Cannot connect. Make sure it\'s running.'}), 500
    
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)