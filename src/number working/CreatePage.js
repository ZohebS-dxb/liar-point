import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

function CreatePage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleCreateGame = () => {
    if (!name.trim()) return;
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    const playerId = uuidv4();
    const db = getDatabase();
    set(ref(db, `rooms/${roomCode}/players/${playerId}`), {
      name,
      isHost: true
    }).then(() => {
      navigate('/lobby', { state: { roomCode, playerId, name, isHost: true } });
    });
  };

  return (
    <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center px-4 text-center font-sans">
      <h1 className="text-3xl font-bold text-[#f7ecdc] mb-6">Create Game</h1>
      <input
        type="text"
        placeholder="Enter your name"
        className="mb-4 px-4 py-3 w-[260px] text-center text-[#b1b5de] placeholder-[#b1b5de] bg-[#f7ecdc] rounded-xl shadow-md"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleCreateGame}
        className="bg-[#f7ecdc] text-[#b1b5de] font-bold text-lg px-8 py-3 rounded-xl shadow hover:opacity-90 transition"
      >
        Start Game
      </button>
    </div>
  );
}

export default CreatePage;