import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDatabase, ref, onValue, set } from 'firebase/database';

function QuestionPage() {
  const location = useLocation();
  const { roomCode, playerId, isHost } = location.state || {};
  const [question, setQuestion] = useState('');
  const [isFaker, setIsFaker] = useState(false);
  const [fakerId, setFakerId] = useState(null);

  useEffect(() => {
    if (!roomCode || !playerId) return;
    const db = getDatabase();

    const questionRef = ref(db, `rooms/${roomCode}/currentQuestion`);
    const fakerRef = ref(db, `rooms/${roomCode}/fakerId`);

    onValue(questionRef, (snapshot) => {
      setQuestion(snapshot.val() || '');
    });

    onValue(fakerRef, (snapshot) => {
      const fid = snapshot.val();
      setFakerId(fid);
      setIsFaker(fid === playerId);
    });
  }, [roomCode, playerId]);

  const handleNextQuestion = async () => {
    const db = getDatabase();
    const questionsRef = ref(db, `rooms/${roomCode}/questions`);
    const fakerIdRef = ref(db, `rooms/${roomCode}/fakerId`);
    const questionRef = ref(db, `rooms/${roomCode}/currentQuestion`);
    const playersRef = ref(db, `rooms/${roomCode}/players`);

    onValue(questionsRef, (snapshot) => {
      const allQs = snapshot.val() || [];
      const remainingQs = allQs.filter((q) => q !== question);
      const nextQ = remainingQs[0] || 'Game Over!';
      set(questionRef, nextQ);

      // Pick a random faker
      onValue(playersRef, (snap) => {
        const players = snap.val() || {};
        const keys = Object.keys(players);
        const randomIndex = Math.floor(Math.random() * keys.length);
        const fakerPlayerId = keys[randomIndex];
        set(fakerIdRef, fakerPlayerId);
      }, { onlyOnce: true });
    }, { onlyOnce: true });
  };

  return (
    <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center text-center font-sans p-4">
      <h1 className="text-2xl text-white font-bold mb-4">Your Prompt</h1>
      <div className="bg-white text-[#b1b5de] text-xl font-semibold px-6 py-4 rounded-xl shadow-md max-w-sm">
        {question === 'Ready to play?' ? question : (isFaker ? 'FAKER — Hold random fingers 1-10' : question)}
      </div>

      {isHost && (
        <button
          onClick={handleNextQuestion}
          className="mt-6 bg-white text-[#b1b5de] font-bold text-lg px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
        >
          Next Question
        </button>
      )}
    </div>
  );
}

export default QuestionPage;
