import React, { useState, useEffect } from 'react';
import './App.css';

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
  
  // New features
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);

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
  const loadQuestions = async (categoryId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/questions/${categoryId}`);
      if (!response.ok) {
        throw new Error('Failed to load questions');
      }
      const data = await response.json();
      // Shuffle questions for variety
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
      loadQuestions(categoryId);
      setAppState('quiz');
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (questionIndex, answerIndex) => {
    const currentQ = questions[questionIndex];
    const isCorrect = answerIndex === currentQ.correct;
    
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
      const response = await fetch(`${API_BASE_URL}/check-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          answers: selectedAnswers,
          category: selectedCategory.id,
          timeElapsed: Math.floor(timeElapsed / 1000)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quiz');
      }

      const result = await response.json();
      
      // Track wrong answers for retry feature
      const wrongQs = [];
      result.results.forEach((r, index) => {
        if (!r.correct) {
          wrongQs.push(questions[index]);
        }
      });
      setWrongAnswers(wrongQs);
      
      setScore(result);
      setAppState('results');
    } catch (err) {
      setError(err.message);
      console.error('Error submitting quiz:', err);
    } finally {
      setLoading(false);
    }
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

  // Category Selection Screen
  if (appState === 'categories') {
    return (
      <div className="app">
        <div className="categories-screen">
          <div className="header">
            <h1>Quiz Master</h1>
            <p>Choose your challenge and test your knowledge!</p>
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
                      <span className="question-count">{category.questionCount} questions</span>
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
        </div>
      </div>
    );
  }

  // Results Screen
  if (appState === 'results') {
    return (
      <div className="app">
        <div className="results-screen">
          <div className="results-header">
            <h1>Quiz Complete!</h1>
            <div className="category-badge" style={{ backgroundColor: selectedCategory?.color }}>
              {selectedCategory?.icon} {selectedCategory?.name}
            </div>
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
            {score.results && score.results.map((result, index) => {
              const questionData = questions[index];
              return (
                <div key={index} className={`result-item ${result.correct ? 'correct' : 'incorrect'}`}>
                  <div className="result-question">
                    <span className="question-number">Q{index + 1}</span>
                    <span className="question-text">{result.question}</span>
                  </div>
                  <div className="result-answers">
                    <div className={`answer-result ${result.correct ? 'correct' : 'incorrect'}`}>
                      <span className="answer-label">Your Answer:</span>
                      <span className="answer-text">{result.user_answer}</span>
                      {result.correct ? <span className="checkmark">CORRECT</span> : <span className="cross">WRONG</span>}
                    </div>
                    {!result.correct && (
                      <div className="correct-answer">
                        <span className="answer-label">Correct Answer:</span>
                        <span className="answer-text">{result.correct_answer}</span>
                      </div>
                    )}
                  </div>
                  {questionData && questionData.explanation && (
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
    );
  }

  // Quiz Screen
  if (appState === 'quiz' && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const isFirstQuestion = currentQuestionIndex === 0;
    const answeredCount = Object.keys(selectedAnswers).length;
    const progress = ((answeredCount / questions.length) * 100).toFixed(0);

    return (
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
    );
  }

  // Loading screen for questions
  return (
    <div className="app">
      <div className="loading-screen">
        <div className="spinner"></div>
        <h2>Loading questions...</h2>
        {error && <p className="error">Error: {error}</p>}
      </div>
    </div>
  );
}
//added route for Leadboard @taben-zw
import Leaderboard from "./Leaderboard";

<Route path="/leaderboard" element={<Leaderboard />} />


export default App;
