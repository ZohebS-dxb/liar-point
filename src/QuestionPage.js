import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import questions from './questions';
import fakerPrompts from './fakerPrompts';

function QuestionPage() {
  const location = useLocation();
  const { roomCode, playerId, isHost } = location.state || {};
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [fakerId, setFakerId] = useState(null);
  const [myPrompt, setMyPrompt] = useState('');

  useEffect(() => {
    if (!roomCode || !playerId) return;
    const db = getDatabase();

    const indexRef = ref(db, `rooms/${roomCode}/questionIndex`);
    const fakerRef = ref(db, `rooms/${roomCode}/fakerId`);

    onValue(indexRef, (snapshot) => {
      const index = snapshot.val() || 0;
      setQuestionIndex(index);
      setCurrentQuestion(questions[index] || 'No more questions');
    });

    onValue(fakerRef, (snapshot) => {
      const id = snapshot.val();
      setFakerId(id);
      if (id === playerId) {
        const randomPrompt = fakerPrompts[Math.floor(Math.random() * fakerPrompts.length)];
        setMyPrompt(randomPrompt);
      }
    });
  }, [roomCode, playerId]);

  const handleNextQuestion = async () => {
    const db = getDatabase();
    const playersRef = ref(db, `rooms/${roomCode}/players`);

    onValue(playersRef, (snapshot) => {
      const players = snapshot.val();
      const playerIds = players ? Object.keys(players) : [];
      if (playerIds.length === 0) return;

      const randomIndex = Math.floor(Math.random() * playerIds.length);
      const selectedFakerId = playerIds[randomIndex];

      const nextIndex = questionIndex + 1;
      set(ref(db, `rooms/${roomCode}/questionIndex`), nextIndex);
      set(ref(db, `rooms/${roomCode}/fakerId`), selectedFakerId);
    }, { onlyOnce: true });
  };

  return (
    <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center px-4 text-center font-sans">
      <h1 className="text-2xl font-bold text-white mb-6">
        {fakerId === playerId ? myPrompt : currentQuestion}
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
