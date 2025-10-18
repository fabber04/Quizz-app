import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import './difficulty-selector.css';
import Leadboard from './Leadboard';
import easyQuestions from './questions/ScienceAndTechnology/easy.json';
import mediumQuestions from './questions/ScienceAndTechnology/medium.json';
import hardQuestions from './questions/ScienceAndTechnology/hard.json';
import anyScienceQuestions from './questions/ScienceAndTechnology/any.json';

import mathEasyQuestions from './questions/Mathematics/easy.json';
import mathMediumQuestions from './questions/Mathematics/medium.json';
import mathHardQuestions from './questions/Mathematics/hard.json';
import mathAnyQuestions from './questions/Mathematics/any.json';

import historyEasyQuestions from './questions/History/easy.json';
import historyMediumQuestions from './questions/History/medium.json';
import historyHardQuestions from './questions/History/hard.json';
import historyAnyQuestions from './questions/History/any.json';

import generalKnowledgeEasyQuestions from './questions/GeneralKnowledge/easy.json';
import generalKnowledgeMediumQuestions from './questions/GeneralKnowledge/medium.json';
import generalKnowledgeHardQuestions from './questions/GeneralKnowledge/hard.json';
import generalKnowledgeAnyQuestions from './questions/GeneralKnowledge/any.json';
import LoginPage from './LoginPage';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [appState, setAppState] = useState('categories'); // categories, quiz, results
  
  // Timer for quiz
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Adding new features for the app 
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [difficulty, setDifficulty] = useState('any'); // for the diificulty levels
  const [loggedInUser, setLoggedInUser] = useState(null); // for the logged in user
  const [showLeaderboard, setShowLeaderboard] = useState(false); // toggle to show the leaderboard
  const [bgMuted, setBgMuted] = useState(false); // background sound
  const bgAudioRef = useRef(null);

  // Auto-play background sound when app loads
  useEffect(() => {
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = 0.3;
      if (!bgMuted) {
        bgAudioRef.current.play().catch(() => {});
      } else {
        bgAudioRef.current.pause();
      }
    }
  }, [bgMuted]);

  // Add logout handler
  const handleLogout = () => {
    setLoggedInUser(null);
    setAppState('categories');
    setSelectedCategory(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(null);
    setError(null);
  };

  // Live timer effect
  useEffect(() => {
    if (appState === 'quiz' && quizStartTime) {
      const timer = setInterval(() => {
        setCurrentTime(Date.now() - quizStartTime);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [appState, quizStartTime]);

  // Load categories from backend
  const loadCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) {
        throw new Error('Failed to load categories');
      }
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message);
      console.error('Error loading categories:', err);
    } finally {
      setLoading(false);
    }
  };

  // Shuffle array helper
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Load questions for selected category
  const loadQuestions = async (categoryId, difficultyLevel = 'any') => {
    setLoading(true);
    setError(null);
    try {
      const selectedCat = categories.find(cat => cat.id === categoryId);

      // Science & Technology
      if (
        selectedCat &&
        selectedCat.name === "Science & Technology"
      ) {
        if (difficultyLevel === "easy") {
          setQuestions(shuffleArray(easyQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
        if (difficultyLevel === "medium") {
          setQuestions(shuffleArray(mediumQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
        if (difficultyLevel === "hard") {
          setQuestions(shuffleArray(hardQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
        if (difficultyLevel === "any") {
          setQuestions(shuffleArray(anyScienceQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
      }

      // Mathematics
      if (
        selectedCat &&
        selectedCat.name === "Mathematics"
      ) {
        if (difficultyLevel === "easy") {
          setQuestions(shuffleArray(mathEasyQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
        if (difficultyLevel === "medium") {
          setQuestions(shuffleArray(mathMediumQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
        if (difficultyLevel === "hard") {
          setQuestions(shuffleArray(mathHardQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
        if (difficultyLevel === "any") {
          setQuestions(shuffleArray(mathAnyQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
      }

      // History
      if (
        selectedCat &&
        selectedCat.name === "History"
      ) {
        if (difficultyLevel === "easy") {
          setQuestions(shuffleArray(historyEasyQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
        if (difficultyLevel === "medium") {
          setQuestions(shuffleArray(historyMediumQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
        if (difficultyLevel === "hard") {
          setQuestions(shuffleArray(historyHardQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
        if (difficultyLevel === "any") {
          setQuestions(shuffleArray(historyAnyQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
      }

      // General Knowledge
      if (
        selectedCat &&
        selectedCat.name === "General Knowledge"
      ) {
        if (difficultyLevel === "easy") {
          setQuestions(shuffleArray(generalKnowledgeEasyQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
        if (difficultyLevel === "medium") {
          setQuestions(shuffleArray(generalKnowledgeMediumQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
        if (difficultyLevel === "hard") {
          setQuestions(shuffleArray(generalKnowledgeHardQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
        if (difficultyLevel === "any") {
          setQuestions(shuffleArray(generalKnowledgeAnyQuestions));
          setSelectedCategory(selectedCat);
          setLoading(false);
          return;
        }
      }

      // Otherwise, fetch from backend
      let url = `${API_BASE_URL}/questions/${categoryId}`;
      if (difficultyLevel !== 'any') {
        url += `?difficulty=${difficultyLevel}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to load questions');
      }
      const data = await response.json();
      const shuffledQuestions = shuffleArray(data.questions || []);
      setQuestions(shuffledQuestions);
      setSelectedCategory(data.category);
    } catch (err) {
      setError(err.message);
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  };

  // Start quiz for selected category
  const startQuiz = (categoryId, retryMode = false, retryQuestions = null) => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(null);
    setQuizStartTime(Date.now());
    setTotalTimeElapsed(0);
    setCurrentTime(0);
    setStreak(0);
    setMaxStreak(0);
    
    if (retryMode && retryQuestions) {
      setQuestions(retryQuestions);
      setAppState('quiz');
    } else {
      loadQuestions(categoryId, difficulty);
      setAppState('quiz');
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const currentQ = questions[questionIndex];
    const isCorrect = answerIndex === currentQ.correct;

    // Play sound effect for either the correct or wrong answer
    playSound(isCorrect ? '/sounds/correct.wav' : '/sounds/wrong.mp3');

    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
    
    // Update streak
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > maxStreak) {
        setMaxStreak(newStreak);
      }
    } else {
      setStreak(0);
    }
    
    // Auto-advance to next question after 1.5s
    setTimeout(() => {
      if (questionIndex < questions.length - 1) {
        setCurrentQuestionIndex(questionIndex + 1);
      }
    }, 1500);
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz and get score
  const submitQuiz = async () => {
    setLoading(true);
    const timeElapsed = Date.now() - quizStartTime;
    setTotalTimeElapsed(timeElapsed);

    try {
      // Calculate score locally
      let correct = 0;
      let wrongQs = [];
      questions.forEach((q, idx) => {
        if (selectedAnswers[idx] === q.correct) {
          correct++;
        } else {
          wrongQs.push(q);
        }
      });
      const total = questions.length;
      const scorePercent = (correct / total) * 100;

      // Play submission sound
      playSound('/sounds/submit.wav');

      // Save user score to leaderboard
      saveUserScore(loggedInUser, selectedCategory.name, Math.round(scorePercent));

      setWrongAnswers(wrongQs);

      // Set score object in state
      setScore({
        correct,
        total,
        score: scorePercent,
     
      });
      setAppState('results');
    } catch (err) {
      setError(err.message);
      console.error('Error submitting quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  // Save user score to local storage (simulating backend)
  const saveUserScore = (username, categoryName, scorePercent) => {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '{}');
    if (!leaderboard[username]) leaderboard[username] = {};
    leaderboard[username][categoryName] = scorePercent;
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
  };

  // Reset to categories
  const resetToCategories = () => {
    setAppState('categories');
    setSelectedCategory(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setScore(null);
    setError(null);
  };

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Format time helper
  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Play sound in the background 
  const playSound = (src) => {
    const audio = new window.Audio(src);
    audio.volume = 0.7; // Adjust volume if needed
    audio.play();
  };

  
  const answeredCount = Object.keys(selectedAnswers).length;
  const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;
  const currentQuestion = questions[currentQuestionIndex] || {};
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <>
      {/* Background sound */}
      <audio
        ref={bgAudioRef}
        src="/sounds/background.mp3"
        loop
        autoPlay
        style={{ display: 'none' }}
      />
      <button
        className="bg-mute-btn"
        style={{
          position: 'fixed',
          top: 16,
          right: 16,
          zIndex: 1000,
          background: bgMuted ? '#ffd700' : '#232526',
          color: bgMuted ? '#232526' : '#ffd700',
          border: 'none',
          borderRadius: '50%',
          width: 48,
          height: 48,
          fontSize: 24,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #0004'
        }}
        onClick={() => setBgMuted(m => !m)}
        title={bgMuted ? 'Unmute background music' : 'Mute background music'}
      >
        {bgMuted ? '🔇' : '🔊'}
      </button>

     
      {!loggedInUser ? (
        <LoginPage onLogin={setLoggedInUser} />
      ) : appState === 'categories' ? (
        <div className="app">
          <div className="categories-screen">
            <div className="header">
              <h1>Quiz Master</h1>
              <p>Choose your challenge and test your knowledge!</p>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
            {/* Difficulty Selector */}
            <div className="difficulty-selector">
              <label>Difficulty: </label>
              <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option value="any">Any</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {error && (
              <div className="error-message">
                <p>Error: {error}</p>
                <p>Make sure the backend server is running on http://localhost:5000</p>
                <button onClick={loadCategories} className="retry-button">Retry</button>
              </div>
            )}

            {loading ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading categories...</p>
              </div>
            ) : (
              <div className="categories-grid">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="category-card"
                    style={{ '--category-color': category.color }}
                    onClick={() => startQuiz(category.id)}
                  >
                    <div className="category-icon">{category.icon}</div>
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-description">{category.description}</p>
                    <div className="category-meta">
                      <div className="category-info-row">
                        <span className="question-count">25 questions</span>
                        {category.highScore > 0 && (
                          <div className="high-score-badge">
                            <span className="trophy-icon">Best: {Math.round(category.highScore)}%</span>
                          </div>
                        )}
                      </div>
                      <div className="start-indicator">Start Quiz</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="leaderboard-btn" onClick={() => setShowLeaderboard(!showLeaderboard)}>
              {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
            </button>
            {showLeaderboard && <Leadboard categories={categories} />}
          </div>
        </div>
      ) : appState === 'results' ? (
        <div className="app">
          <div className="results-screen">
            <div className="results-header">
              <h1>Quiz Complete!</h1>
              <div className="category-badge" style={{ backgroundColor: selectedCategory?.color }}>
                {selectedCategory?.icon} {selectedCategory?.name}
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>

            {score.isNewHighScore && (
              <div className="new-high-score-banner">
                <span className="trophy-large">TROPHY</span>
                <h2>New High Score!</h2>
                <p>You beat your previous best of {Math.round(score.previousHighScore)}%</p>
              </div>
            )}

            <div className="score-display">
              <div className="score-circle">
                <div className="score-number">{score.correct}/{score.total}</div>
                <div className="score-percentage">{Math.round(score.score)}%</div>
              </div>
              <div className="score-text">
                <h2>{score.correct === score.total ? 'Perfect Score!' : 
                     score.score >= 80 ? 'Great Job!' : 
                     score.score >= 60 ? 'Good Work!' : 'Keep Practicing!'}</h2>
                <p>You got {score.correct} out of {score.total} questions correct</p>
                <p className="time-taken">Time: {formatTime(totalTimeElapsed)}</p>
                {score.currentHighScore > 0 && !score.isNewHighScore && (
                  <p className="high-score-info">
                    Best Score: {Math.round(score.currentHighScore)}%
                  </p>
                )}
              </div>
            </div>

            <div className="detailed-results">
              <h3>Review Your Answers</h3>
              {questions.map((questionData, index) => {
                // Find user's answer and correctness
                const userAnswerIndex = selectedAnswers[index];
                const userAnswer = userAnswerIndex !== undefined ? questionData.options[userAnswerIndex] : 'No answer';
                const correctAnswer = questionData.options[questionData.correct];
                const isCorrect = userAnswerIndex === questionData.correct;

                return (
                  <div key={index} className={`result-item ${isCorrect ? 'correct' : 'incorrect'}`}>
                    <div className="result-question">
                      <span className="question-number">Q{index + 1}</span>
                      <span className="question-text">{questionData.question}</span>
                    </div>
                    <div className="result-answers">
                      <div className={`answer-result ${isCorrect ? 'correct' : 'incorrect'}`}>
                        <span className="answer-label">Your Answer:</span>
                        <span className="answer-text">{userAnswer}</span>
                        {isCorrect ? <span className="checkmark">CORRECT</span> : <span className="cross">WRONG</span>}
                      </div>
                      {!isCorrect && (
                        <div className="correct-answer">
                          <span className="answer-label">Correct Answer:</span>
                          <span className="answer-text">{correctAnswer}</span>
                        </div>
                      )}
                    </div>
                    {questionData.explanation && (
                      <div className="result-explanation">
                        <span className="explanation-label">Explanation:</span>
                        <p className="explanation-text">{questionData.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {maxStreak > 1 && (
              <div className="max-streak-display">
                <span className="max-streak-icon">FIRE</span>
                <p>Best Streak: {maxStreak} correct in a row!</p>
              </div>
            )}

            <div className="results-actions">
              <button className="action-button secondary" onClick={resetToCategories}>
                Choose Another Category
              </button>
              {wrongAnswers.length > 0 && (
                <button 
                  className="action-button retry-wrong" 
                  onClick={() => startQuiz(selectedCategory.id, true, wrongAnswers)}
                >
                  Practice Wrong Answers ({wrongAnswers.length})
                </button>
              )}
              <button className="action-button primary" onClick={() => startQuiz(selectedCategory.id)}>
                Retry Full Quiz
              </button>
            </div>
          </div>
        </div>
      ) : appState === 'quiz' && questions.length > 0 ? (
        <div className="app">
          <div className="quiz-container">
            <div className="quiz-header">
              <div className="quiz-title">
                <div className="category-info">
                  <span className="category-icon" style={{ color: selectedCategory?.color }}>
                    {selectedCategory?.icon}
                  </span>
                  <span className="category-name">{selectedCategory?.name}</span>
                </div>
                <div className="quiz-stats-row">
                  <div className="quiz-timer">
                    <span className="timer-icon">TIME</span>
                    <span className="timer-value">{formatTime(currentTime)}</span>
                  </div>
                  {streak > 0 && (
                    <div className="streak-counter">
                      <span className="streak-icon">FIRE</span>
                      <span className="streak-value">{streak} Streak!</span>
                    </div>
                  )}
                </div>
                <button className="back-button" onClick={resetToCategories}>Back</button>
              </div>
              
              <div className="quiz-progress-info">
                <div className="progress-stats">
                  <span className="progress-label">Progress: {answeredCount}/{questions.length} answered</span>
                  <span className="progress-percentage">{progress}% Complete</span>
                </div>
                {answeredCount === questions.length && (
                  <div className="ready-submit-message">
                    All questions answered! Click Submit below to see your results.
                  </div>
                )}
              </div>

              <div className="progress-section">
                <div className="progress-text">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ 
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                      backgroundColor: selectedCategory?.color
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="question-container">
              <div className="question-header">
                <h2 className="question-text">{currentQuestion.question}</h2>
              </div>
              
              <div className="answers-container">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswers[currentQuestionIndex] === index;
                  const isCorrect = index === currentQuestion.correct;
                  const isWrong = isSelected && !isCorrect;
                  const showFeedback = selectedAnswers[currentQuestionIndex] !== undefined;
                  
                  return (
                    <button
                      key={index}
                      className={`answer-button ${
                        isSelected ? 'selected' : ''
                      } ${showFeedback && isCorrect ? 'correct-answer' : ''} ${
                        showFeedback && isWrong ? 'wrong-answer' : ''
                      }`}
                      onClick={() => handleAnswerSelect(currentQuestionIndex, index)}
                      disabled={selectedAnswers[currentQuestionIndex] !== undefined}
                      style={{
                        '--category-color': selectedCategory?.color
                      }}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                      <span className="option-text">{option}</span>
                      {showFeedback && isCorrect && <span className="feedback-icon">CHECK</span>}
                      {showFeedback && isWrong && <span className="feedback-icon">CROSS</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="navigation">
              <button 
                className="nav-button" 
                onClick={previousQuestion} 
                disabled={isFirstQuestion}
              >
                Previous
              </button>
              
              <div className="question-indicators">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`indicator ${
                      index === currentQuestionIndex ? 'current' : 
                      selectedAnswers[index] !== undefined ? 'answered' : 'unanswered'
                    }`}
                    onClick={() => setCurrentQuestionIndex(index)}
                    title={`Question ${index + 1}`}
                  />
                ))}
              </div>
              
              {isLastQuestion && answeredCount === questions.length ? (
                <button 
                  className="nav-button primary submit-btn" 
                  onClick={submitQuiz}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Quiz'}
                </button>
              ) : (
                <button 
                  className="nav-button" 
                  onClick={nextQuestion}
                  disabled={isLastQuestion}
                >
                  Next
                </button>
              )}
            </div>

            {error && <p className="error-message">Error: {error}</p>}
          </div>
        </div>
      ) : (
        <div className="app">
          <div className="loading-screen">
            <div className="spinner"></div>
            <h2>Loading questions...</h2>
            {error && <p className="error">Error: {error}</p>}
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
