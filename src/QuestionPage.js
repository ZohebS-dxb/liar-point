
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { database } from "./firebase";
import { ref, onValue, set } from "firebase/database";

function QuestionPage() {
  const location = useLocation();
  const { roomCode, playerId } = location.state || {};
  const [questionData, setQuestionData] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const questionRef = ref(database, `rooms/${roomCode}/currentQuestion`);
    const unsub = onValue(questionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setQuestionData(data);
      }
    });

    const playersRef = ref(database, `rooms/${roomCode}/players`);
    const unsubPlayers = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlayers(Object.entries(data).map(([id, value]) => ({ id, ...value })));
      }
    });

    return () => {
      unsub();
      unsubPlayers();
    };
  }, [roomCode]);

  const isHost = players.length > 0 && players[0].id === playerId;

  const showNextQuestion = () => {
    // Generate a new question
    import("../questions").then(({ questions }) => {
      import("../fakerPrompts").then(({ fakerPrompts }) => {
        const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
        const randomPrompt = fakerPrompts[Math.floor(Math.random() * fakerPrompts.length)];
        const fakerIndex = Math.floor(Math.random() * players.length);
        const fakerId = players[fakerIndex].id;

        const newQuestion = {
          question: randomQuestion.question,
          fakerPrompt: randomPrompt,
          fakerId,
        };

        set(ref(database, `rooms/${roomCode}/currentQuestion`), newQuestion);
      });
    });
  };

  if (!questionData) return <div className="p-4 font-sans text-center">Loading...</div>;

  const isFaker = questionData.fakerId === playerId;
  const displayText = isFaker ? questionData.fakerPrompt : questionData.question;

  return (
    <div className="p-4 font-sans text-center">
      <h2 className="text-2xl font-bold mb-6">{displayText}</h2>
      {isHost && (
        <button
          onClick={showNextQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600"
        >
          Next Question
        </button>
      )}
    </div>
  );
}

export default QuestionPage;
