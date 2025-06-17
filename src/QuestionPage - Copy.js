
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

    const hostRef = ref(db, `rooms/${roomCode}/players/${playerId}/isHost`);
    onValue(hostRef, (snapshot) => {
      setIsHost(snapshot.val());
    });

    const questionRef = ref(db, `rooms/${roomCode}/currentQuestion`);
    onValue(questionRef, (snapshot) => {
      const index = snapshot.val();
      if (index !== null && index < questions.length) {
        setCurrentQuestion(questions[index]);
      }
    });

    const playersRef = ref(db, `rooms/${roomCode}/players`);
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const playerList = Object.entries(data).map(([id, value]) => ({
        id,
        ...value,
      }));
      setPlayers(playerList);
    });

    const fakerRef = ref(db, `rooms/${roomCode}/fakerId`);
    onValue(fakerRef, (snapshot) => {
      setFakerId(snapshot.val());
    });
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
        {isFaker ? 'FAKER' : currentQuestion}
      </h1>
      {isHost && (
        <button
          onClick={handleNextQuestion}
          className="mt-4 bg-[#f7ecdc] text-[#b1b5de] font-bold text-lg px-8 py-3 rounded-xl shadow hover:opacity-90 transition"
        >
          Next Question
        </button>
      )}
    </div>
  );
}

export default QuestionPage;
