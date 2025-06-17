import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import questions from './questions';

function QuestionPage() {
  const location = useLocation();
  const { roomCode, playerId, isHost } = location.state || {};

  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [fakerId, setFakerId] = useState(null);
  const [myPrompt, setMyPrompt] = useState('');

  const fakerPrompts = [
    "You're the IMPOSTER. Show any random number of fingers from 1 to 10!",
    "You’re the Faker! Bluff with a number.",
    "Act natural – fake a number!",
    "You don’t know the question. Just pick a number!",
    "No clue what's going on? Perfect. Show some fingers!",
    "Wing it. Any number from 1 to 10!",
    "Pretend you understood. Hold up a number!",
    "Guess time! Pick a number. Hope it works!",
    "You’re the secret Faker. Pick wisely.",
    "Look confident and show a number!",
    "Don’t get caught. Hold up a number!",
    "Keep a straight face. Any number from 1 to 10!",
    "Pick a number. Hope they don’t catch you!",
    "Bluff mode ON. Choose a number!",
    "Improvise! Show 1–10 fingers.",
    "You’re the imposter. Choose fast!",
    "Fake it like you mean it.",
    "Smile and pick a number!",
    "Fool them all. Choose a number.",
    "Act smart – show a number!",
    "Faker alert! Fingers up – now!",
    "Don’t panic. Hold up fingers.",
    "Play cool. Pick a random number.",
    "All eyes on you. Pick one!",
    "Quick! Hold up fingers. Act normal."
  ];

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

  const handleNextQuestion = () => {
    const db = getDatabase();
    const nextIndex = questionIndex + 1;

    // Pick random fakerId from player list
    const fakerCandidate = Math.random().toString(36).substring(2, 9);
    set(ref(db, `rooms/${roomCode}/questionIndex`), nextIndex);
    set(ref(db, `rooms/${roomCode}/fakerId`), fakerCandidate);
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