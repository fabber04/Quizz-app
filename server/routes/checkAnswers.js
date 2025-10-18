const express = require('express');
const router = express.Router();

router.post('/check-answers', (req, res) => {
  const { answers, questions } = req.body;

  // Defensive: If answers is an object (from your frontend), convert to array
  let answerArr = Array.isArray(answers) ? answers : [];
  if (!Array.isArray(answers)) {
    // answers is an object like {0: 2, 1: 1, ...}
    answerArr = Object.keys(answers).map(idx => answers[idx]);
  }

  // Review all questions
  const results = questions.map((q, idx) => {
    const userAnswerIdx = answerArr[idx];
    return {
      question: q.question,
      user_answer: q.options && userAnswerIdx !== undefined ? q.options[userAnswerIdx] : null,
      correct_answer: q.options ? q.options[q.correct] : null,
      correct: userAnswerIdx === q.correct
    };
  });

  const correctCount = results.filter(r => r.correct).length;
  const total = results.length;
  const score = total > 0 ? (correctCount / total) * 100 : 0;

  res.json({
    results,
    correct: correctCount,
    total,
    score
  });
});

module.exports = router;