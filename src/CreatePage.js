import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from './firebase';
import { ref, set, push } from 'firebase/database';

function generateRoomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export default function CreatePage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleStartGame = async () => {
    if (!name.trim()) return;

    const roomCode = generateRoomCode();
    const playerRef = push(ref(database, 'rooms/' + roomCode + '/players'));
    const playerId = playerRef.key;

    await set(playerRef, {
      name,
      isHost: true // ✅ Mark this player as the host
    });

    navigate('/lobby', { state: { roomCode, playerId } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#b1b5de] px-4">
      <h1 className="text-3xl font-bold text-[#fef1dd] mb-6">Create Game</h1>
      <input
        type="text"
        placeholder="Enter your name"
        className="mb-6 p-3 rounded-xl w-full max-w-xs text-center"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleStartGame}
        className="rounded-2xl bg-[#fef1dd] text-xl font-bold text-[#b1b5de] py-4 px-8"
      >
        Start Game
      </button>
    </div>
  );
}
