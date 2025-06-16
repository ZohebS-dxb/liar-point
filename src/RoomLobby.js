import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';

export default function RoomLobby() {
  const location = useLocation();
  const roomCode = location.state?.roomCode;
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!roomCode) return;

    const playersRef = ref(database, 'rooms/' + roomCode + '/players');
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playerList = Object.values(data).map((p) => p.name);
        setPlayers(playerList);
      }
    });

    return () => unsubscribe();
  }, [roomCode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#b1b5de] px-4 text-center">
      <h2 className="text-3xl font-bold text-[#fef1dd] mb-4">Room Lobby</h2>
      <h3 className="text-white text-xl mb-2">Room Code: {roomCode}</h3>

      <ul className="mb-8 text-white text-lg">
        {players.map((player, index) => (
          <li key={index}>👤 {player}</li>
        ))}
      </ul>

      <button
        className="w-full max-w-md rounded-2xl bg-[#fef1dd] text-xl font-bold text-[#b1b5de] py-4"
        onClick={() => alert('Game will start soon!')}
      >
        START GAME
      </button>
    </div>
  );
}
