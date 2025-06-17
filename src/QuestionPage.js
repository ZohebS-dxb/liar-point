
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import fakerPrompts from './fakerPrompts';
import questions from './questions';

function QuestionPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, playerId } = location.state || {};
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [fakerId, setFakerId] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);
  const db = getDatabase();

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const playersRef = ref(db, `rooms/${roomCode}/players`);
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const playerList = Object.keys(data);
        setPlayers(playerList);
        if (playerId === playerList[0]) {
          setIsHost(true);
        }
      }
    });

    const gameRef = ref(db, `rooms/${roomCode}/game`);
    onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setQuestionIndex(data.currentQuestionIndex || 0);
        setFakerId(data.fakerId || null);
      }
    });
  }, [roomCode, playerId]);

  const handleNextQuestion = () => {
    const nextIndex = questionIndex + 1;
    const newFakerId = players[Math.floor(Math.random() * players.length)];
    const gameRef = ref(db, `rooms/${roomCode}/game`);
    set(gameRef, {
      currentQuestionIndex: nextIndex,
      fakerId: newFakerId,
    });
  };

  useEffect(() => {
    if (questionIndex < questions.length) {
      setCurrentQuestion(questions[questionIndex]);
    }
  }, [questionIndex]);

  if (!roomCode || !playerId) {
    return <div className="text-center mt-10 text-white">Invalid room or player ID</div>;
  }

  const isFaker = playerId === fakerId;
  const displayText = isFaker
    ? fakerPrompts[Math.floor(Math.random() * fakerPrompts.length)]
    : currentQuestion;

  return (
    <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center text-center px-4 font-sans">
      <h1 className="text-3xl font-bold text-white mb-6">{displayText}</h1>
      {isHost && (
        <button
          onClick={handleNextQuestion}
          className="mt-4 bg-[#f7ecdc] text-[#b1b5de] font-bold text-lg px-6 py-3 rounded-xl shadow hover:opacity-90 transition"
        >
          Next Question
        </button>
      )}
    </div>
  );
}

export default QuestionPage;
