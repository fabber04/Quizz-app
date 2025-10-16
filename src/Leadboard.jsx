import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/leaderboard")
      .then(res => res.json())
      .then(data => setData(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="leaderboard-container">
      <h2 className="text-center text-3xl font-bold text-cyan-400 mb-6">🏆 Leaderboard</h2>
      <table className="w-full text-white border-collapse">
        <thead>
          <tr className="bg-cyan-700">
            <th className="p-2 text-left">Player</th>
            <th className="p-2 text-left">Score</th>
            <th className="p-2 text-left">Category</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-gray-600">
              <td className="p-2">{row.player}</td>
              <td className="p-2">{row.score}</td>
              <td className="p-2">{row.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
