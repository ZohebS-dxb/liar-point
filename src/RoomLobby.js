
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue, set } from 'firebase/database';

function RoomLobby() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, playerId, name, isHost } = location.state || {};
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const db = getDatabase();
    const playersRef = ref(db, `rooms/${roomCode}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      const playerList = data ? Object.values(data) : [];
      setPlayers(playerList);
    });

    const phaseRef = ref(db, `rooms/${roomCode}/phase`);
    const phaseUnsub = onValue(phaseRef, (snapshot) => {
      const phase = snapshot.val();
      if (phase === 'selectgame') {
        navigate('/selectgame', { state: { roomCode, playerId, name, isHost } });
      }
    });

    return () => {
      unsubscribe();
      phaseUnsub();
    };
  }, [roomCode, playerId, name, isHost, navigate]);

  const startGame = () => {
    const db = getDatabase();
    set(ref(db, `rooms/${roomCode}/phase`), 'selectgame');
  };

  return (
    <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center px-4 text-center font-sans">
      <h1 className="text-3xl font-bold text-[#f7ecdc] mb-6">Who's Playing?</h1>
      <ul className="mb-6 space-y-2">
        {players.map((player, index) => (
          <li key={index} className="text-lg text-white">{player.name}</li>
        ))}
      </ul>
      <p className="text-[#f7ecdc] mb-2">Room Code: <strong>{roomCode}</strong></p>
      {isHost && (
        <button
          onClick={startGame}
          className="mt-4 bg-[#f7ecdc] text-[#b1b5de] font-bold text-lg px-8 py-3 rounded-xl shadow hover:opacity-90 transition"
        >
          Start Game
        </button>
      )}
    </div>
  );
}

export default RoomLobby;
