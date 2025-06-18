
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, set } from 'firebase/database';

function GameSelectPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, playerId, isHost, name } = location.state || {};

  const handleGameSelect = (gameKey) => {
    const db = getDatabase();
    set(ref(db, `rooms/${roomCode}/selectedGame`), gameKey);
    set(ref(db, `rooms/${roomCode}/phase`), 'question');
    navigate('/question', { state: { roomCode, playerId, isHost, name } });
  };

  return (
    <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center text-center px-4 font-sans">
      <h1 className="text-3xl font-bold text-[#f7ecdc] mb-6">Choose a Game</h1>
      {['numberPicker', 'pointItOut', 'whosTheImposter', 'raiseYourHand', 'whosTheCelebrity'].map((game) => (
        <button
          key={game}
          onClick={() => handleGameSelect(game)}
          className="bg-[#f7ecdc] text-[#b1b5de] font-bold text-lg px-8 py-6 rounded-xl shadow hover:opacity-90 transition m-2 w-64"
        >
          {game.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
        </button>
      ))}
    </div>
  );
}

export default GameSelectPage;
