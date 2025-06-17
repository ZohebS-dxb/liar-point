import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ref, onValue, set } from "firebase/database";
import { database } from "./firebase";
import questions from "./questions";
import fakerPrompts from "./fakerPrompts";

function QuestionPage() {
  const location = useLocation();
  const { roomCode, playerId } = location.state || {};
  const [question, setQuestion] = useState("");
  const [isHost, setIsHost] = useState(false);
  const [isFaker, setIsFaker] = useState(false);

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const hostRef = ref(database, `rooms/${roomCode}/host`);
    const fakerRef = ref(database, `rooms/${roomCode}/faker`);
    const qIndexRef = ref(database, `rooms/${roomCode}/questionIndex`);

    onValue(hostRef, (snapshot) => {
      setIsHost(snapshot.val() === playerId);
    });

    onValue(fakerRef, (snapshot) => {
      setIsFaker(snapshot.val() === playerId);
    });

    onValue(qIndexRef, (snapshot) => {
      const index = snapshot.val() || 0;
      if (index < questions.length) {
        setQuestion(questions[index]);
      } else {
        setQuestion("No more questions!");
      }
    });
  }, [roomCode, playerId]);

  const handleNext = () => {
    const qIndexRef = ref(database, `rooms/${roomCode}/questionIndex`);
    const fakerRef = ref(database, `rooms/${roomCode}/faker`);

    onValue(qIndexRef, (snapshot) => {
      let index = snapshot.val() || 0;
      const nextIndex = (index + 1) % questions.length;
      set(qIndexRef, nextIndex);

      // Randomly assign faker
      const playersRef = ref(database, `rooms/${roomCode}/players`);
      onValue(playersRef, (snap) => {
        const players = snap.val();
        const keys = Object.keys(players || {});
        const randomFaker = keys[Math.floor(Math.random() * keys.length)];
        set(fakerRef, randomFaker);
      }, { onlyOnce: true });
    }, { onlyOnce: true });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center font-sans">
      <h2 className="text-2xl font-bold mb-4">Question</h2>
      <p className="text-xl mb-6">
        {isFaker
          ? fakerPrompts[Math.floor(Math.random() * fakerPrompts.length)]
          : question}
      </p>
      {isHost && (
        <button
          onClick={handleNext}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Next Question
        </button>
      )}
    </div>
  );
}

export default QuestionPage;
