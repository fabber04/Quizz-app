import React from 'react';
import './leaderboard.css';

function Leadboard({ categories }) {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '{}');
  const usernames = Object.keys(leaderboard);

  // Calculate average scores
  const userStats = usernames.map(username => {
    const scores = categories.map(cat =>
      leaderboard[username][cat.name] !== undefined
        ? leaderboard[username][cat.name]
        : null
    );
    const validScores = scores.filter(s => s !== null);
    const avg =
      validScores.length > 0
        ? (
            validScores.reduce((sum, s) => sum + s, 0) / validScores.length
          ).toFixed(2)
        : null;
    return {
      username,
      scores,
      avg: avg ? Number(avg) : null,
    };
  });

  // Sort by average score descending
  const sortedStats = [...userStats].sort((a, b) => (b.avg || 0) - (a.avg || 0));

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <table className="leaderboard-table">
        <thead>
          <tr>
            <th>Position</th>
            <th>User</th>
            {categories.map(cat => (
              <th key={cat.id}>{cat.name}</th>
            ))}
            <th>Average Score</th>
          </tr>
        </thead>
        <tbody>
          {sortedStats.length === 0 ? (
            <tr>
              <td colSpan={categories.length + 3}>No scores yet.</td>
            </tr>
          ) : (
            sortedStats.map((user, idx) => (
              <tr key={user.username}>
                <td>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                </td>
                <td>{user.username}</td>
                {user.scores.map((score, i) => (
                  <td key={categories[i].id}>
                    {score !== null ? `${score}%` : '-'}
                  </td>
                ))}
                <td>
                  {user.avg !== null ? `${user.avg}%` : '-'}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Leadboard;

