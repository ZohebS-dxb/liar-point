import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function QuestionPage() {
  const navigate = useNavigate();
  const question = "How many children do you want?"; // this will be dynamic later

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#b1b5de] px-4 text-center">
      <h2 className="text-3xl font-bold text-[#fef1dd] mb-8">{question}</h2>

      <button
        className="w-full max-w-md rounded-2xl bg-[#fef1dd] text-xl font-bold text-[#b1b5de] py-4"
        onClick={() => navigate(-1)}
      >
        BACK
      </button>
    </div>
  );
}
