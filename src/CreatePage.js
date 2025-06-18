
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, push } from 'firebase/database';

function CreatePage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!name.trim()) return;

    const db = getDatabase();
    const roomRef = push(ref(db, 'rooms'));
    const roomCode = roomRef.key;
    const playerId = 'player-' + Math.random().toString(36).substr(2, 9);

    await set(ref(db, `rooms/${roomCode}`), {
      phase: 'selectGame',
      players: {
        [playerId]: {
          name,
          isHost: true,
        },
      },
    });

    navigate('/lobby', {
      state: {
        roomCode,
        playerId,
        name,
        isHost: true,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center px-4 text-center font-sans">
      <h1 className="text-3xl font-bold text-[#f7ecdc] mb-6">Create Game</h1>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 px-4 py-2 rounded border border-gray-300 focus:outline-none"
      />
      <button
        onClick={handleCreateRoom}
        className="bg-[#f7ecdc] text-[#b1b5de] font-bold text-lg px-8 py-3 rounded-xl shadow hover:opacity-90 transition"
      >
        Create Room
      </button>
    </div>
  );
}

export default CreatePage;
