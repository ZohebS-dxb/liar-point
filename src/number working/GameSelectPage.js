import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from 'firebase/database';

function GameSelectPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, playerId, isHost, name } = location.state || {};

  const handleGameSelect = () => {
    const db = getDatabase();

    // ✅ Set phase to 'game' so everyone moves forward
    set(ref(db, `rooms/${roomCode}/phase`), 'game');

    navigate('/question', { state: { roomCode, playerId, isHost, name } });
  };

  return (
    <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center text-center px-4 font-sans">
      <h1 className="text-3xl font-bold text-[#f7ecdc] mb-6">Choose a Game</h1>
      <button
        onClick={handleGameSelect}
        className="bg-[#f7ecdc] text-[#b1b5de] font-bold text-lg px-8 py-6 rounded-xl shadow hover:opacity-90 transition"
      >
        Number Picker
      </button>
    </div>
  );
}

export default GameSelectPage;
