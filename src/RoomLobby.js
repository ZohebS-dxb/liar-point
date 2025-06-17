
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import './index.css';

function RoomLobby() {
  const location = useLocation();
  const { roomCode, playerId, name, isHost } = location.state || {};
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const db = getDatabase();
    const playersRef = ref(db, `rooms/${roomCode}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      const playerList = data ? Object.values(data) : [];
      setPlayers(playerList);
    });

    return () => unsubscribe();
  }, [roomCode]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-purple-800 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Who's Playing?</h1>
      <ul className="mb-4">
        {players.map((player, index) => (
          <li key={index} className="text-lg">{player.name}</li>
        ))}
      </ul>
      <p className="text-sm">Room Code: <strong>{roomCode}</strong></p>
    </div>
  );
}

export default RoomLobby;
