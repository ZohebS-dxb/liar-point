
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from 'firebase/database';
import { v4 as uuidv4 } from 'uuid';
import './index.css';

function CreatePage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const generateRoomCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
  };

  const handleCreateGame = () => {
    if (name.trim() === '') return;
    const roomCode = generateRoomCode();
    const playerId = uuidv4();
    const db = getDatabase();
    set(ref(db, `rooms/${roomCode}/players/${playerId}`), {
      name,
      isHost: true,
    }).then(() => {
      navigate('/lobby', { state: { roomCode, playerId, name, isHost: true } });
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-800 text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Create a Game</h1>
      <input
        type="text"
        placeholder="Enter your name"
        className="mb-4 px-4 py-2 text-black rounded shadow"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleCreateGame}
        className="bg-white text-purple-800 font-bold py-2 px-6 rounded shadow hover:bg-purple-200 transition"
      >
        Create Game
      </button>
    </div>
  );
}

export default CreatePage;
