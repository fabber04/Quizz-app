# Simple Quiz Server - Python Flask
# This is our backend server that provides quiz questions

from flask import Flask, jsonify
from flask_cors import CORS
import json
import os
import openai

# Create our Flask app
app = Flask(__name__)
CORS(app)  # This allows our frontend to talk to our backend

# High scores storage file
HIGH_SCORES_FILE = 'high_scores.json'

# Initialize high scores
def load_high_scores():
    """Load high scores from file"""
    if os.path.exists(HIGH_SCORES_FILE):
        try:
            with open(HIGH_SCORES_FILE, 'r') as f:
                return json.load(f)
        except:
            return {}
    return {}

def save_high_scores(scores):
    """Save high scores to file"""
    with open(HIGH_SCORES_FILE, 'w') as f:
        json.dump(scores, f, indent=2)
        
# Quiz categories with questions
QUIZ_CATEGORIES = {
    "general": {
        "name": "General Knowledge",
        "description": "Test your general knowledge",
        "icon": "G",
        "color": "#667eea",
        "questions": [
            {
                "id": 1,
                "question": "What is the capital of France?",
                "options": ["London", "Berlin", "Paris", "Madrid"],
                "correct": 2,
                "explanation": "Paris has been the capital of France since 508 AD and is known as the City of Light."
            },
            {
                "id": 2,
                "question": "What color is the sky?",
                "options": ["Red", "Blue", "Green", "Yellow"],
                "correct": 1,
                "explanation": "The sky appears blue due to Rayleigh scattering of sunlight in Earth's atmosphere."
            },
            {
                "id": 3,
                "question": "What is the largest planet in our solar system?",
                "options": ["Earth", "Jupiter", "Saturn", "Neptune"],
                "correct": 1,
                "explanation": "Jupiter is the largest planet with a mass 318 times that of Earth and could fit all other planets inside it."
            }
        ]
    },
    
    "science": {
        "name": "Science & Technology",
        "description": "Explore the world of science",
        "icon": "S",
        "color": "#764ba2",
        "questions": [
            {
                "id": 4,
                "question": "What is H2O?",
                "options": ["Hydrogen", "Water", "Oxygen", "Salt"],
                "correct": 1,
                "explanation": "H2O is the chemical formula for water - two hydrogen atoms bonded to one oxygen atom."
            },
            {
                "id": 5,
                "question": "What is the speed of light?",
                "options": ["300,000 km/s", "150,000 km/s", "600,000 km/s", "900,000 km/s"],
                "correct": 0,
                "explanation": "Light travels at approximately 299,792 km/s in a vacuum, commonly rounded to 300,000 km/s."
            },
            {
                "id": 6,
                "question": "What does DNA stand for?",
                "options": ["Deoxyribonucleic Acid", "Digital Network Array", "Dynamic Neural Algorithm", "Data Network Access"],
                "correct": 0,
                "explanation": "DNA (Deoxyribonucleic Acid) is the molecule that carries genetic instructions for life."
            }
        ]
    },
    "math": {
        "name": "Mathematics",
        "description": "Challenge your math skills",
        "icon": "M",
        "color": "#f093fb",
        "questions": [
            {
                "id": 7,
                "question": "What is 15 x 8?",
                "options": ["120", "110", "130", "140"],
                "correct": 0,
                "explanation": "15 x 8 = 120. You can calculate this as (10 x 8) + (5 x 8) = 80 + 40 = 120."
            },
            {
                "id": 8,
                "question": "What is the square root of 64?",
                "options": ["6", "7", "8", "9"],
                "correct": 2,
                "explanation": "The square root of 64 is 8, because 8 x 8 = 64."
            },
            {
                "id": 9,
                "question": "What is pi approximately?",
                "options": ["3.14", "2.71", "1.41", "4.13"],
                "correct": 0,
                "explanation": "Pi is approximately 3.14159... It represents the ratio of a circle's circumference to its diameter."
            }
        ]
    },
    "history": {
        "name": "History",
        "description": "Journey through time",
        "icon": "H",
        "color": "#ffecd2",
        "questions": [
            {
                "id": 10,
                "question": "When did World War II end?",
                "options": ["1944", "1945", "1946", "1947"],
                "correct": 1,
                "explanation": "World War II ended in 1945 with Germany's surrender in May and Japan's surrender in September."
            },
            {
                "id": 11,
                "question": "Who painted the Mona Lisa?",
                "options": ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
                "correct": 2,
                "explanation": "Leonardo da Vinci painted the Mona Lisa between 1503-1519. It's now displayed in the Louvre Museum in Paris."
            },
            {
                "id": 12,
                "question": "What year did the Berlin Wall fall?",
                "options": ["1987", "1988", "1989", "1990"],
                "correct": 2,
                "explanation": "The Berlin Wall fell on November 9, 1989, marking a key moment in the end of the Cold War."
            }
        ]
    }
}

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")  # Make sure to set this in your environment

def generate_ai_question(category_name):
    prompt = (
        f"Generate a multiple-choice quiz question for the category '{category_name}'. "
        "Provide the question, 4 options, the correct option index, and a brief explanation in JSON format: "
        '{"question": "...", "options": ["..."], "correct": 0, "explanation": "..."}'
    )
    client = openai.OpenAI(api_key=OPENAI_API_KEY)
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",  # <-- Change here!
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200,
    )
    try:
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception:
        return None

# Route to get all categories
@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Return all quiz categories with high scores"""
    categories = []
    for key, category in QUIZ_CATEGORIES.items():
        category_data = {
            "id": key,
            "name": category["name"],
            "description": category["description"],
            "icon": category["icon"],
            "color": category["color"],
            "questionCount": len(category["questions"])
        }
        # Add high score if exists
        if key in high_scores:
            category_data["highScore"] = high_scores[key]
        categories.append(category_data)
    return jsonify({"categories": categories})

# Route to get questions for a specific category
@app.route('/api/questions/<category_id>', methods=['GET'])
def get_questions(category_id):
    """Return questions for a specific category"""
    if category_id not in QUIZ_CATEGORIES:
        return jsonify({"error": "Category not found"}), 404
    
    category = QUIZ_CATEGORIES[category_id]
    return jsonify({
        "category": {
            "id": category_id,
            "name": category["name"],
            "description": category["description"],
            "icon": category["icon"],
            "color": category["color"]
        },
        "questions": category["questions"],
        "total": len(category["questions"])
    })

# Route to check answers
@app.route('/api/check-answers', methods=['POST'])
def check_answers():
    """Check the user's answers and return score"""
    from flask import request
    
    # Get the data from the frontend
    data = request.get_json()
    user_answers = data.get('answers', {})
    category_id = data.get('category')
    time_elapsed = data.get('timeElapsed', 0)
    
    if not category_id or category_id not in QUIZ_CATEGORIES:
        return jsonify({"error": "Invalid category"}), 400
    
    questions = QUIZ_CATEGORIES[category_id]["questions"]
    
    # Calculate score
    correct = 0
    results = []
    
    for i, question in enumerate(questions):
        user_answer = user_answers.get(str(i))  # Handle both string and int keys
        if user_answer is None:
            user_answer = user_answers.get(i)
        correct_answer = question['correct']
        
        is_correct = user_answer == correct_answer
        if is_correct:
            correct += 1
            
        results.append({
            "question_id": question['id'],
            "question": question['question'],
            "user_answer": question['options'][user_answer] if user_answer is not None else "No answer",
            "correct_answer": question['options'][correct_answer],
            "correct": is_correct
        })
    
    # Calculate percentage
    score_percentage = (correct / len(questions)) * 100
    
    # Check and update high score
    is_new_high_score = False
    previous_high_score = high_scores.get(category_id, 0)
    
    if score_percentage > previous_high_score:
        high_scores[category_id] = score_percentage
        save_high_scores(high_scores)
        is_new_high_score = True
    
    return jsonify({
        "score": score_percentage,
        "correct": correct,
        "total": len(questions),
        "category": category_id,
        "results": results,
        "isNewHighScore": is_new_high_score,
        "previousHighScore": previous_high_score,
        "currentHighScore": high_scores.get(category_id, 0),
        "timeElapsed": time_elapsed
    })

# Route to get high scores
@app.route('/api/high-scores', methods=['GET'])
def get_high_scores():
    """Return all high scores"""
    return jsonify({"highScores": high_scores})

# Route to get high score for specific category and for the leadboard
@app.route('/api/high-scores/<category_id>', methods=['GET'])
def get_category_high_score(category_id):
    """Return high score for a specific category"""
    if category_id not in QUIZ_CATEGORIES:
        return jsonify({"error": "Category not found"}), 404
    
    return jsonify({
        "category": category_id,
        "highScore": high_scores.get(category_id, 0)
    })
    
@app.route('/api/leaderboard')
def get_leaderboard():
    try:
        with open('high_scores.json', 'r') as f:
            scores = json.load(f)
        # Flatten and sort scores across categories
        leaderboard = []
        for category, entries in scores.items():
            for entry in entries:
                leaderboard.append({
                    "name": entry["name"],
                    "score": entry["score"],
                    "category": category
                })
        leaderboard.sort(key=lambda x: x["score"], reverse=True)
        return jsonify(leaderboard)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/ai-questions', methods=['GET'])
def get_ai_questions():
    """Generate 25 random AI questions matching categories"""
    if not OPENAI_API_KEY:
        return jsonify({"error": "OpenAI API key not set"}), 500

    categories = list(QUIZ_CATEGORIES.keys())
    questions = []
    import random
    for _ in range(25):
        cat_key = random.choice(categories)
        cat_name = QUIZ_CATEGORIES[cat_key]["name"]
        q = generate_ai_question(cat_name)
        if q:
            q["category"] = cat_key
            questions.append(q)
    return jsonify({"questions": questions, "total": len(questions)})

# Run the server
if __name__ == '__main__':
    print("Starting Quiz Server...")
    total_questions = sum(len(cat["questions"]) for cat in QUIZ_CATEGORIES.values())
    print(f"Available categories: {len(QUIZ_CATEGORIES)}")
    print(f"Total questions: {total_questions}")
    print("Server will run on: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
