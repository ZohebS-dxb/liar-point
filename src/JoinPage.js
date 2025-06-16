import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from './firebase';
import { ref, get, push, set } from 'firebase/database';

export default function JoinPage() {
  const [roomCode, setRoomCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!roomCode || !playerName) {
      alert("Enter both room code and name");
      return;
    }

    const roomRef = ref(database, 'rooms/' + roomCode);
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      alert("Room not found");
      return;
    }

    const playersRef = ref(database, 'rooms/' + roomCode + '/players');
    const newPlayerRef = push(playersRef);

    await set(newPlayerRef, {
      name: playerName,
      isHost: false
    });

    navigate('/lobby', { state: { roomCode } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#b1b5de] px-4 text-center">
      <h2 className="text-3xl font-bold text-[#fef1dd] mb-8">Join a Game</h2>

      <input
        type="text"
        className="w-full max-w-md mb-4 px-4 py-3 rounded-xl text-[#b1b5de] text-xl"
        placeholder="Enter Room Code"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />

      <input
        type="text"
        className="w-full max-w-md mb-4 px-4 py-3 rounded-xl text-[#b1b5de] text-xl"
        placeholder="Enter Your Name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
      />

      <button
        className="w-full max-w-md rounded-2xl bg-[#fef1dd] text-xl font-bold text-[#b1b5de] py-4"
        onClick={handleJoin}
      >
        JOIN GAME
      </button>
    </div>
  );
}
