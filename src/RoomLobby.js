import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';

const RoomLobby = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, playerId, isHost, name } = location.state || {};

  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!roomCode || !playerId || !name) {
      navigate('/');
      return;
    }

    const db = getDatabase();
    const playersRef = ref(db, `rooms/${roomCode}/players`);
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const playersArray = Object.values(data);
      setPlayers(playersArray);
    });
  }, [roomCode, playerId, name, navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen font-sans">
      <h1 className="text-3xl font-bold mb-6">Who's Playing?</h1>
      <ul className="mb-6">
        {players.map((player, index) => (
          <li key={index} className="text-lg">{player.name}</li>
        ))}
      </ul>
      {isHost && (
        <button
          className="bg-green-600 text-white px-6 py-3 rounded"
          onClick={() =>
            navigate('/question', {
              state: { roomCode, playerId }
            })
          }
        >
          Start Game
        </button>
      )}
    </div>
  );
};

export default RoomLobby;
