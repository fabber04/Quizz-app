# Quiz Master - Advanced Quiz Application

A modern, feature-rich quiz application built with **React.js** (frontend) and **Python Flask** (backend) featuring live timers, achievements, statistics, high score tracking, and a beautiful responsive UI.

![Version](https://img.shields.io/badge/version-2.0-blue)
![React](https://img.shields.io/badge/React-19.1.0-61dafb)
![Flask](https://img.shields.io/badge/Flask-Latest-green)

---

## Key Features

### Core Features
- Multiple Quiz Categories: General Knowledge, Science, Math, History
- Live Timer: Real-time tracking of quiz duration
- High Score System: Persistent high score tracking for each category
- Achievement System: Unlock achievements for great performance
- Statistics Dashboard: View time, accuracy, and score breakdown
- Sound Effects: Toggle-able audio feedback
- Progress Tracking: Live progress indicators and completion percentage
- Beautiful UI/UX: Modern gradients, animations, and responsive design

### Achievements
- Perfect Score - Get 100% on a quiz
- Quiz Master - Score 90% or higher
- Speed Demon - Complete quiz quickly with high score
- Record Breaker - Set a new high score

### What's Tracked
- Total time spent on quiz
- Accuracy percentage
- Best score per category
- Achievements earned

---

## Quick Start

### Prerequisites
- Python 3.7+
- Node.js 14+
- npm or yarn

### Method 1: Quick Start (Recommended)

**Windows:**
```bash
# Double-click start-react-app.bat
```

### Method 2: Manual Start

**Backend (Flask Server):**
   ```bash
   cd backend
pip install -r requirements.txt
python quiz_server.py
```
Server runs on: http://localhost:5000

**Frontend (React App):**
```bash
# In a new terminal, from project root
npm install
npm start
```
App opens automatically at: http://localhost:3000 (or 3003 if 3000 is busy)

---

## How to Use

### 1. **Home Screen**
- View all quiz categories
- See your high scores on each category
- Toggle sound effects on/off
- Click any category to start

### 2. **During Quiz**
- Answer questions with live timer running
- Navigate back and forth between questions
- See progress percentage
- Visual feedback on answered questions

### 3. **Results Screen**
- View your statistics (time, accuracy, score)
- See if you earned any achievements
- Check if you beat your high score
- Review all answers with explanations
- Retry or choose another category

---

## Project Structure

```
quiz-app/
- backend/
  - quiz_server.py       # Flask API server
  - requirements.txt     # Python dependencies
  - high_scores.json     # Persistent high scores
  - __init__.py
- src/
  - App.js              # Main React component
  - App.css             # Styling and animations
  - index.js            # React entry point
  - ...
- public/
  - index.html          # HTML template
  - ...
- package.json            # React dependencies
- start-react-app.bat     # Windows startup script
- PROJECT_EXPLANATION.txt # Detailed documentation
- ENHANCEMENTS.md         # Recent improvements
- README.md              # This file
```

---

## API Endpoints

### `GET /api/categories`
Returns all quiz categories with high scores
```json
{
  "categories": [
    {
      "id": "general",
      "name": "General Knowledge",
      "description": "Test your general knowledge",
      "questionCount": 3,
      "highScore": 100
    }
  ]
}
```

### `GET /api/questions/{category_id}`
Returns questions for a specific category
```json
{
  "category": {...},
  "questions": [...],
  "total": 3
}
```

### `POST /api/check-answers`
Submit answers and get results
```json
{
  "answers": {"0": 1, "1": 2, "2": 0},
  "category": "general",
  "timeElapsed": 45
}
```

Response:
```json
{
  "score": 100,
  "correct": 3,
  "total": 3,
  "isNewHighScore": true,
  "previousHighScore": 66.67,
  "currentHighScore": 100,
  "timeElapsed": 45,
  "results": [...]
}
```

### `GET /api/high-scores`
Get all high scores

### `GET /api/high-scores/{category_id}`
Get high score for specific category

---

## Customization

### Add New Questions
Edit `backend/quiz_server.py`:
```python
QUIZ_CATEGORIES = {
    "your_category": {
        "name": "Your Category",
        "description": "Description here",
        "icon": "Y",
        "color": "#your_color",
        "questions": [
            {
                "id": 1,
                "question": "Your question?",
                "options": ["A", "B", "C", "D"],
                "correct": 0  # Index of correct answer
            }
        ]
    }
}
```

### Modify Styling
Edit `src/App.css`:
- Change colors and gradients
- Modify animations
- Adjust responsive breakpoints
- Update category colors

### Add Features
Ideas for enhancement:
- User accounts and authentication
- Global leaderboards
- More question types (true/false, multiple select)
- Difficulty levels
- Timed challenges
- Social media sharing

---

## Technology Stack

### Frontend
- **React** 19.1.0 - UI framework
- **JavaScript ES6+** - Modern JavaScript
- **CSS3** - Animations and styling
- **Fetch API** - HTTP requests
- **Web Audio API** - Sound effects

### Backend
- **Python** 3.x - Programming language
- **Flask** - Web framework
- **Flask-CORS** - Cross-origin support
- **JSON** - Data storage

---

## Responsive Design

The app is fully responsive and works on:
- Mobile phones (320px+)
- Tablets (768px+)
- Laptops (1024px+)
- Desktop (1440px+)

---

## Troubleshooting

### Backend not loading
- Ensure Python is installed: `python --version`
- Install dependencies: `pip install -r requirements.txt`
- Check port 5000 is available
- Look for error messages in terminal

### Frontend not loading
- Ensure Node.js is installed: `node --version`
- Install dependencies: `npm install`
- Check if port 3000 is available
- Clear browser cache

### CORS Errors
- Make sure Flask-CORS is installed
- Check backend is running on port 5000
- Verify API_BASE_URL in App.js

### High Scores Not Saving
- Check write permissions in backend folder
- Look for `high_scores.json` file
- Check backend console for errors

---

## Learning Resources

This project demonstrates:
- Full-stack development
- RESTful API design
- React state management
- Responsive web design
- Modern UI/UX practices
- Animation and transitions
- Local storage with JSON
- Sound synthesis
- Achievement systems

---

## Performance

- Fast load times
- 60fps animations
- Lightweight (< 5MB)
- Efficient sound effects
- Persistent data storage

---

## Documentation

For detailed documentation, see:
- **PROJECT_EXPLANATION.txt** - Comprehensive project overview
- **ENHANCEMENTS.md** - Recent improvements and features
- Code comments in `App.js` and `quiz_server.py`

---

## Credits

**Developed by Group 6**

Built with love using React and Flask

### Version History
- **v2.0** - Major UI/UX overhaul, achievements, timer, statistics
- **v1.5** - Added high score tracking
- **v1.0** - Initial release with React frontend

---

## License

This project is for educational purposes.

---

## Features Showcase

### Before & After

**Original Features:**
- Basic quiz functionality
- Category selection
- Score calculation

**New Features Added:**
- Live timer system
- Achievement popups
- Statistics dashboard
- Sound effects
- Modern UI/UX
- Mobile optimization
- High score tracking
- Progress indicators

---

## Contributing

Feel free to:
1. Add more questions
2. Create new categories
3. Improve UI/UX
4. Fix bugs
5. Add features

---

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Review PROJECT_EXPLANATION.txt
3. Check browser console (F12)
4. Verify both servers are running

---

**Enjoy your quiz experience!**
