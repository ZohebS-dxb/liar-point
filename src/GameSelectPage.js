import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, onValue } from 'firebase/database';

function GameSelectPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, playerId, isHost, name } = location.state || {};
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const phaseRef = ref(db, `rooms/${roomCode}/phase`);
    onValue(phaseRef, (snapshot) => {
      const phase = snapshot.val();
      if (phase === 'question') {
        navigate('/question', { state: { roomCode, playerId, isHost, name } });
      }
    });

    if (isHost) {
      setReady(true);
    }
  }, [roomCode, playerId, isHost, name, navigate]);

  const handleGameSelect = (gameKey) => {
    const db = getDatabase();
    set(ref(db, `rooms/${roomCode}/selectedGame`), gameKey);
    set(ref(db, `rooms/${roomCode}/phase`), 'question');
    navigate('/question', { state: { roomCode, playerId, isHost, name } });
  };

  if (!ready && isHost) return <div className="text-white">Loading...</div>;
  if (!isHost) return (
    <div className="min-h-screen bg-[#b1b5de] flex justify-center items-center text-center px-4 font-sans text-white">
      Host is choosing a game...
    </div>
  );

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
