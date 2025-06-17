import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';

function QuestionPage() {
  const location = useLocation();
  const { roomCode, playerId } = location.state || {};
  const [question, setQuestion] = useState('');
  const [isFaker, setIsFaker] = useState(false);

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const db = getDatabase();

    // Watch current question
    const questionRef = ref(db, `rooms/${roomCode}/currentQuestion`);
    const questionListener = onValue(questionRef, (snapshot) => {
      const q = snapshot.val();
      if (q !== null) {
        setQuestion(q);
      }
    });

    // Watch current faker
    const fakerRef = ref(db, `rooms/${roomCode}/fakerId`);
    const fakerListener = onValue(fakerRef, (snapshot) => {
      const id = snapshot.val();
      setIsFaker(id === playerId);
    });

    return () => {
      questionListener();
      fakerListener();
    };
  }, [roomCode, playerId]);

  return (
    <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center text-center font-sans p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Your Prompt</h1>
      <div className="bg-white text-[#b1b5de] text-xl font-semibold px-6 py-4 rounded-xl shadow-md max-w-sm">
        {question ? (isFaker ? 'FAKER — Hold random fingers 1-10' : question) : 'Loading...'}
      </div>
    </div>
  );
}

export default QuestionPage;
