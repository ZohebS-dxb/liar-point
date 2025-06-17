import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getDatabase, ref, onValue, set } from "firebase/database";
import fakerPrompts from "./fakerPrompts";
import questions from "./questions";

function QuestionPage() {
  const location = useLocation();
  const { roomCode, playerId } = location.state || {};
  const [questionData, setQuestionData] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const db = getDatabase();

    const qRef = ref(db, `rooms/${roomCode}/currentQuestion`);
    const playersRef = ref(db, `rooms/${roomCode}/players`);

    onValue(qRef, (snapshot) => {
      const data = snapshot.val();
      setQuestionData(data);
    });

    onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlayers(Object.entries(data).map(([id, val]) => ({ id, ...val })));
      }
    });
  }, [roomCode]);

  const isHost = players.find(p => p.id === playerId)?.isHost;
  const isFaker = questionData?.fakerId === playerId;

  const handleNextQuestion = () => {
    const db = getDatabase();
    const newQuestion = questions[Math.floor(Math.random() * questions.length)];
    const newPrompt = fakerPrompts[Math.floor(Math.random() * fakerPrompts.length)];
    const randomFaker = players[Math.floor(Math.random() * players.length)];

    const next = {
      question: newQuestion.question || newQuestion,
      fakerPrompt: newPrompt,
      fakerId: randomFaker.id
    };

    set(ref(db, `rooms/${roomCode}/currentQuestion`), next);
  };

  if (!questionData) return <div className="text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#b1b5de] flex flex-col justify-center items-center px-4 text-center font-sans">
      <h2 className="text-2xl font-bold text-[#f7ecdc] mb-6">Question</h2>
      <p className="text-xl text-white mb-10 max-w-md">
        {isFaker ? questionData.fakerPrompt : questionData.question}
      </p>
      {isHost && (
        <button
          onClick={handleNextQuestion}
          className="bg-[#f7ecdc] text-[#b1b5de] font-bold text-lg px-8 py-3 rounded-xl shadow hover:opacity-90 transition"
        >
          Next Question
        </button>
      )}
    </div>
  );
}

export default QuestionPage;