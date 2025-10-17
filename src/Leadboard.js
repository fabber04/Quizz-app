import React from 'react';

export default function Leadboard({ categories }) {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '{}');
  const users = Object.keys(leaderboard);

  // Build rows: username, scores per category, total
  const rows = users.map(username => {
    const scores = leaderboard[username];
    let total = 0;
    let count = 0;
    const categoryScores = categories.map(cat => {
      const score = scores[cat.name] || 0;
      if (score) {
        total += score;
        count += 1;
      }
      return score;
    });
    return {
      username,
      categoryScores,
      total: count ? Math.round(total / count) : 0
    };
  });

  // Sort by total descending
  rows.sort((a, b) => b.total - a.total);

  return (
    <div className="leaderboard-section">
      <h2>Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>User</th>
            {categories.map(cat => (
              <th key={cat.name}>{cat.name}</th>
            ))}
            <th>Avg Score</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.username}>
              <td>{row.username}</td>
              {row.categoryScores.map((score, i) => (
                <td key={i}>{score ? `${score}%` : '-'}</td>
              ))}
              <td>{row.total ? `${row.total}%` : '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

