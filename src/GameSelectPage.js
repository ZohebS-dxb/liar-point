import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, set } from 'firebase/database';

function GameSelectPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, playerId, isHost, name } = location.state || {};

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const db = getDatabase();
    const phaseRef = ref(db, `rooms/${roomCode}/phase`);

    const unsubscribe = onValue(phaseRef, (snapshot) => {
      const phase = snapshot.val();
      if (phase === 'question') {
        navigate('/question', { state: { roomCode, playerId, isHost, name } });
      }
    });

    return () => unsubscribe();
  }, [roomCode, playerId, isHost, name, navigate]);

  const handleGameSelect = () => {
    const db = getDatabase();
    set(ref(db, `rooms/${roomCode}/selectedGame`), 'numberPicker'); // Set game name
    set(ref(db, `rooms/${roomCode}/phase`), 'question'); // Start game
  };

  if (!isHost) {
    return (
      <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center text-center px-4 font-sans">
        <h1 className="text-2xl font-bold text-white">
          Host is choosing a game...
        </h1>
      </div>
    );
  }

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
