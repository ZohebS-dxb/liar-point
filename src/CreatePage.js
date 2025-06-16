import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreatePage() {
  const [joinCode, setJoinCode] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const code = Math.floor(1000 + Math.random() * 9000);
    setJoinCode(code.toString());
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#b1b5de] px-4">
      <h1 className="text-6xl font-bold mb-10 tracking-widest" style={{ fontFamily: 'cursive' }}>
        <span className="text-orange-500">L</span>
        <span className="text-green-500">I</span>
        <span className="text-yellow-400">A</span>
        <span className="text-pink-500">R</span>
      </h1>
      <p className="text-3xl font-bold text-[#fef1dd] mb-4">{joinCode}</p>
      <button
        className="w-full max-w-md rounded-2xl bg-[#fef1dd] text-xl font-bold text-[#b1b5de] py-4"
        onClick={() => navigate('/game')}
      >
        START
      </button>
      <a href="/join" className="text-white underline mt-4">Join with a code</a>
    </div>
  );
}
