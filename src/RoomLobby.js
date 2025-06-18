
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';

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

    // Listen to game phase changes
    const phaseRef = ref(db, `rooms/${roomCode}/phase`);
    const phaseUnsub = onValue(phaseRef, (snapshot) => {
      const phase = snapshot.val();
      if (phase === 'gameSelect' && isHost) {
        navigate('/gameselect', { state: { roomCode, playerId, name, isHost } });
      } else if (phase === 'gameSelect' && !isHost) {
        navigate('/waiting', { state: { roomCode, playerId, name, isHost } });
      } else if (phase === 'question') {
        navigate('/question', { state: { roomCode, playerId, name, isHost } });
      }
    });

    return () => {
      unsubscribe();
      phaseUnsub();
    };
  }, [roomCode, playerId, name, isHost, navigate]);

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
        <p className="text-[#f7ecdc] mt-4">Waiting for you to select a game...</p>
      )}
    </div>
  );
}

export default RoomLobby;
