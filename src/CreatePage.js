import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';

const CreatePage = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!name.trim()) return;

    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    const playerId = uuidv4();

    const db = getDatabase();
    set(ref(db, `rooms/${roomCode}/players/${playerId}`), {
      name,
      isHost: true
    });

    navigate('/lobby', {
      state: {
        roomCode,
        playerId,
        isHost: true,
        name
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center font-sans">
      <h1 className="text-3xl font-bold mb-4">Create Game</h1>
      <input
        className="border p-2 mb-4"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={handleCreateRoom}
      >
        Create Game
      </button>
    </div>
  );
};

export default CreatePage;
