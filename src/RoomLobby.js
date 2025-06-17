
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "./firebase";
import { ref, onValue, set } from "firebase/database";
import { fakerPrompts } from "../fakerPrompts";
import { questions } from "../questions";

function RoomLobby({ roomCode, playerId }) {
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const playersRef = ref(database, `rooms/${roomCode}/players`);
    const unsub = onValue(playersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setPlayers(Object.entries(data).map(([id, value]) => ({ id, ...value })));
      }
    });

    // Listen for game start
    const currentQuestionRef = ref(database, `rooms/${roomCode}/currentQuestion`);
    const unsubQuestion = onValue(currentQuestionRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        navigate("/question", {
          state: {
            roomCode,
            playerId,
          },
        });
      }
    });

    return () => {
      unsub();
      unsubQuestion();
    };
  }, [roomCode, playerId, navigate]);

  const startGame = () => {
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const randomPrompt = fakerPrompts[Math.floor(Math.random() * fakerPrompts.length)];
    const fakerIndex = Math.floor(Math.random() * players.length);
    const fakerId = players[fakerIndex].id;

    const currentQuestion = {
      question: randomQuestion.question,
      fakerPrompt: randomPrompt,
      fakerId,
    };

    set(ref(database, `rooms/${roomCode}/currentQuestion`), currentQuestion);
  };

  return (
    <div className="p-4 font-sans text-center">
      <h2 className="text-2xl font-bold mb-4">Who's Playing?</h2>
      <ul className="mb-6">
        {players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      <button
        onClick={startGame}
        className="bg-green-500 text-white px-4 py-2 rounded-xl hover:bg-green-600"
      >
        Start Game
      </button>
    </div>
  );
}

export default RoomLobby;
