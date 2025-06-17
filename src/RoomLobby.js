import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ref, onValue, set } from 'firebase/database';
import { database } from './firebase';

function RoomLobby() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, playerId } = location.state || {};
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const roomRef = ref(database, `rooms/${roomCode}`);
    const playersRef = ref(database, `rooms/${roomCode}/players`);

    const unsubscribeRoom = onValue(roomRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setIsHost(data.hostId === playerId);
      }
    });

    const unsubscribePlayers = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playerList = Object.values(data).map(p => p.name);
        setPlayers(playerList);
      }
    });

    return () => {
      unsubscribeRoom();
      unsubscribePlayers();
    };
  }, [roomCode, playerId]);

  const startGame = () => {
    set(ref(database, `rooms/${roomCode}/gameStarted`), true);
    navigate('/question', { state: { roomCode, playerId } });
  };

  return (
    <div className="min-h-screen bg-[#E6E6FA] flex flex-col items-center justify-center text-center p-6 font-sans">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-purple-700">Who's Playing?</h2>
        <ul className="mb-6 text-gray-700">
          {players.map((name, idx) => (
            <li key={idx}>{name}</li>
          ))}
        </ul>
        {isHost && (
          <button
            className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-full shadow hover:bg-purple-700 transition"
            onClick={startGame}
          >
            Start Game
          </button>
        )}
      </div>
    </div>
  );
}

export default RoomLobby;