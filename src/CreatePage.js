import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from './firebase';
import { ref, set } from 'firebase/database';
import './index.css';

function CreatePage() {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleCreate = () => {
    if (!name) return;
    const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
    set(ref(database, `rooms/${roomCode}/players/${Date.now()}`), {
      name,
      isHost: true
    });
    navigate('/lobby', { state: { roomCode, name, isHost: true } });
  };

  return (
    <div className="min-h-screen bg-indigo-900 text-white flex flex-col justify-center items-center font-sans">
      <h1 className="text-4xl mb-6">Create Game</h1>
      <input
        className="mb-4 p-2 rounded text-black"
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button
        onClick={handleCreate}
        className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
      >
        Create Room
      </button>
    </div>
  );
}
export default CreatePage;