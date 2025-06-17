import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { database } from './firebase';
import { ref, push, set, get } from 'firebase/database';

export default function JoinPage() {
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const handleJoin = async () => {
    if (!name || !roomCode) return;

    const roomRef = ref(database, 'rooms/' + roomCode + '/players');
    const snapshot = await get(roomRef);

    if (!snapshot.exists()) {
      alert('Room not found');
      return;
    }

    const playerRef = push(roomRef);
    const playerId = playerRef.key;

    await set(playerRef, {
      name,
      isHost: false
    });

    navigate('/lobby', {
      state: {
        roomCode,
        playerId
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#b1b5de] px-4 font-sans">
      <h1 className="text-3xl font-bold text-[#fef1dd] mb-6">Who's Playing?</h1>

      <input
        type="text"
        placeholder="Enter your name"
        className="mb-4 p-3 rounded-xl w-full max-w-xs text-center"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter Room Code"
        className="mb-6 p-3 rounded-xl w-full max-w-xs text-center"
        value={roomCode}
        onChange={(e) => setRoomCode(e.target.value)}
      />

      <button
        onClick={handleJoin}
        className="rounded-2xl bg-[#fef1dd] text-xl font-bold text-[#b1b5de] py-4 px-8"
      >
        Join Game
      </button>
    </div>
  );
}
