import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from './firebase';
import { ref, set } from 'firebase/database';

export default function CreatePage() {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);
  }, []);

  const handleStartGame = () => {
    if (!playerName) return alert('Please enter your name');

    set(ref(database, 'rooms/' + roomCode), {
      host: playerName,
      players: {
        [Date.now()]: {
          name: playerName,
          isHost: true
        }
      },
      state: 'lobby'
    });

    navigate('/lobby', { state: { roomCode } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#b1b5de] px-4 text-center">
      <h2 className="text-3xl font-bold text-[#fef1dd] mb-2">Your Room Code:</h2>
      <div className="text-5xl font-bold text-white mb-8">{roomCode}</div>

      <input
        type="text"
        className="w-full max-w-md mb-4 px-4 py-3 rounded-xl text-[#b1b5de] text-xl"
        placeholder="Enter your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />

      <button
        className="w-full max-w-md rounded-2xl bg-[#fef1dd] text-xl font-bold text-[#b1b5de] py-4"
        onClick={handleStartGame}
      >
        START GAME
      </button>
    </div>
  );
}
