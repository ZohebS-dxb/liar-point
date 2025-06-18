
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, push } from 'firebase/database';

function CreatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');

  const handleCreate = () => {
    if (!name.trim()) return;
    const db = getDatabase();
    const roomRef = push(ref(db, 'rooms'));
    const roomCode = roomRef.key;
    const playerId = Date.now().toString();

    set(ref(db, `rooms/${roomCode}/players/${playerId}`), {
      name,
      isHost: true,
    });

    set(ref(db, `rooms/${roomCode}/phase`), 'gameSelect'); // ✅ Start in gameSelect phase

    navigate('/lobby', {
      state: { roomCode, playerId, name, isHost: true },
    });
  };

  return (
    <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center text-center px-4 font-sans">
      <h1 className="text-3xl font-bold text-[#f7ecdc] mb-6">Create a Game</h1>
      <input
        type="text"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 px-4 py-2 rounded-lg w-64 text-center"
      />
      <button
        onClick={handleCreate}
        className="bg-[#f7ecdc] text-[#b1b5de] font-bold text-lg px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
      >
        Start Game
      </button>
    </div>
  );
}

export default CreatePage;
