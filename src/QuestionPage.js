
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import questions from './questions';

function QuestionPage() {
  const location = useLocation();
  const { roomCode, playerId } = location.state || {};
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isHost, setIsHost] = useState(false);
  const [players, setPlayers] = useState([]);
  const [fakerId, setFakerId] = useState(null);

  useEffect(() => {
  if (!roomCode || !playerId) return;
  const db = getDatabase();

  const indexRef = ref(db, `rooms/${roomCode}/questionIndex`);
  const fakerRef = ref(db, `rooms/${roomCode}/fakerId`);

  const indexUnsub = onValue(indexRef, (snapshot) => {
    const index = snapshot.val() || 0;
    setQuestionIndex(index);
    setCurrentQuestion(questions[index] || 'No more questions');
  });

  const fakerUnsub = onValue(fakerRef, (snapshot) => {
    const id = snapshot.val();
    setFakerId(id);

    // Always choose a new prompt if this player is the faker
    if (id === playerId) {
      const randomPrompt = fakerPrompts[Math.floor(Math.random() * fakerPrompts.length)];
      setMyPrompt(randomPrompt);
    } else {
      setMyPrompt('');
    }
  });

  return () => {
    indexUnsub();
    fakerUnsub();
  };
}, [roomCode, playerId]);


  const handleNextQuestion = () => {
    const db = getDatabase();
    const questionRef = ref(db, `rooms/${roomCode}/currentQuestion`);
    const fakerRef = ref(db, `rooms/${roomCode}/fakerId`);

    onValue(questionRef, (snapshot) => {
      let index = snapshot.val() || 0;
      index = index + 1 < questions.length ? index + 1 : 0;

      set(questionRef, index);

      // Random faker
      const randomFaker =
        players[Math.floor(Math.random() * players.length)]?.id || null;
      set(fakerRef, randomFaker);
    }, { onlyOnce: true });
  };

  const isFaker = playerId === fakerId;

  
  return (
    <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center px-4 text-center font-sans">
      <h1 className="text-2xl font-bold text-white mb-6">
        {fakerId === playerId
          ? "Act smart – show a number!"
          : currentQuestion}
      </h1>
      {isHost && (
        <button
          onClick={handleNextQuestion}
          className="bg-white text-[#b1b5de] px-6 py-3 rounded-xl shadow font-bold hover:opacity-90 transition"
        >
          Next Question
        </button>
      )}
    </div>
  );
}

export default QuestionPage;
