import React, { useState, useEffect } from 'react';

export default function RoomLobby() {
  // Placeholder names (will come from Firebase later)
  const [players, setPlayers] = useState([
    'Zoheb', 'Ashu', 'Divya'
  ]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#b1b5de] px-4 text-center">
      <h2 className="text-3xl font-bold text-[#fef1dd] mb-4">Waiting for Players</h2>

      <ul className="mb-8 text-white text-lg">
        {players.map((player, index) => (
          <li key={index}>👤 {player}</li>
        ))}
      </ul>

      <button
        className="w-full max-w-md rounded-2xl bg-[#fef1dd] text-xl font-bold text-[#b1b5de] py-4"
        onClick={() => alert('Starting game soon...')}
      >
        START GAME
      </button>
    </div>
  );
}
