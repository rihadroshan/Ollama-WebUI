# Ollama WebUI
**Ollama WebUI** is a responsive web interface designed for interacting with local AI models. It provides a minimal, user-friendly chat experience with support for both dark and light modes, real-time responses, and accessibility features.

## Features
- **Responsive UI** — Smooth experience across all devices.
- **Real-time AI Interaction** — Instant feedback powered by your preferred AI model.
- **Dark & Light Modes** — Effortlessly switch between themes.
- **Accessibility First** — Designed with inclusivity in mind.
- **Customization Ready** — Easily configure your AI model and tailor the experience to your needs.

## **Installation**
1. Clone this repository:
   ```bash
   git clone https://github.com/rihadroshan/chatbot.git
   cd Ollama-WebUI
   ```

2. Install Python dependencies:
   ```bash
   pip install flask flask-cors requests
   ```

## **Usage**
### Start the Server
```bash
python3 app.py
```

### Configure AI Model
In `app.py`, set your preferred Ollama model:
```python
'model': '',  # Add your preferred model here
```

## **License**
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## **Contributions & Reporting Issues:**

Contributions of new features, improvements, or bug fixes are always welcome!

Feel free to open a pull request or open an issue.

## **Files in the Repository**
- **`app.py`**: Flask server and Ollama integration
- **`static/script.js`**: Frontend JavaScript functionality
- **`static/styles.css`**: CSS styling and themes
- **`templates/index.html`**: HTML structure
- **`requirements.txt`**: Python dependencies
- **`README.md`**: This documentation file
