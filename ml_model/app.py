from flask import Flask, request, jsonify
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import pytesseract
import cv2
import re
import random
import os

app = Flask(__name__)

# Load trained model (make sure recyclable_model.pkl exists)
model = joblib.load('recyclable_model.pkl')

def extract_text_from_image(image_path):
    image = cv2.imread(image_path)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    text = pytesseract.image_to_string(gray)
    return text

def parse_attributes(text):
    def extract(pattern, fallback):
        match = re.search(pattern, text)
        return match.group(1).strip() if match else fallback

    power = extract(r'(\d{2,3})W', str(random.choice([10, 20, 65, 150])))
    material = 1 if "PP" in text else (0 if "ABS" in text else random.choice([0, 1]))
    recycle = 1 if "recycle" in text.lower() or "♻" in text else 0

    return {
        'Power_Wattage': float(power),
        'Material_Code': material,
        'Recycling_Symbol': recycle
    }

def predict_recyclability(attributes):
    feature_names = ["Power_Wattage", "Recycling_Symbol", "Material_Code"]
    df = pd.DataFrame([[attributes["Power_Wattage"],
                        attributes["Recycling_Symbol"],
                        attributes["Material_Code"]]],
                      columns=feature_names)

    prediction = model.predict(df)
    return "Can be Recycled" if prediction[0] == 1 else "Not Recyclable"

@app.route('/predict/analyze-image', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files['image']

    # Save temporarily
    upload_dir = 'uploads'
    os.makedirs(upload_dir, exist_ok=True)
    image_path = os.path.join(upload_dir, file.filename)
    file.save(image_path)

    try:
        text = extract_text_from_image(image_path)
        attributes = parse_attributes(text)
        prediction = predict_recyclability(attributes)

        return jsonify({
            "extracted_text": text,
            "attributes": attributes,
            "prediction": prediction
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        # Clean up temp file
        if os.path.exists(image_path):
            os.remove(image_path)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5008, debug=True)

