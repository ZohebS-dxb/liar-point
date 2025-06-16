import React, { useState } from 'react';

export default function JoinPage() {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const handleJoin = () => {
    alert(`Joining game with name: ${name}, code: ${code}`);
    // Navigate to game screen or send to Firebase
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#b1b5de] px-4">
      <h2 className="text-3xl font-bold text-[#fef1dd] mb-6">Join Game</h2>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4 w-full max-w-md rounded-2xl px-6 py-4 text-lg bg-[#fef1dd] focus:outline-none"
      />

      <input
        type="text"
        placeholder="Enter join code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="mb-6 w-full max-w-md rounded-2xl px-6 py-4 text-lg bg-[#fef1dd] focus:outline-none"
      />

      <button
        className="w-full max-w-md rounded-2xl bg-[#fef1dd] text-xl font-bold text-[#b1b5de] py-4"
        onClick={handleJoin}
      >
        Join Game
      </button>
    </div>
  );
}
