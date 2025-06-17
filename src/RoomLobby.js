import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';

function RoomLobby() {
  const location = useLocation();
  const { roomCode, name, isHost } = location.state || {};
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!roomCode) return;
    const playersRef = ref(database, `rooms/${roomCode}/players`);
    return onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      const playersList = data ? Object.values(data).map(p => p.name) : [];
      setPlayers(playersList);
    });
  }, [roomCode]);

  if (!roomCode) return <div className="text-white">Room not found</div>;

  return (
    <div className="min-h-screen bg-indigo-900 text-white flex flex-col items-center justify-center font-sans">
      <h1 className="text-4xl mb-6">Who's Playing?</h1>
      <p className="mb-4">Room Code: <strong>{roomCode}</strong></p>
      <ul className="mb-6">
        {players.map((player, index) => (
          <li key={index} className="text-lg">{player}</li>
        ))}
      </ul>
      {isHost && (
        <button className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600">
          Start Game
        </button>
      )}
    </div>
  );
}
export default RoomLobby;