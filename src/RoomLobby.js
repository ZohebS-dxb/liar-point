
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../firebase";
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

    return () => unsub();
  }, [roomCode]);

  const startGame = () => {
    // Choose a random question and faker prompt
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
    const randomPrompt = fakerPrompts[Math.floor(Math.random() * fakerPrompts.length)];

    // Choose a random player to be the faker
    const fakerIndex = Math.floor(Math.random() * players.length);
    const fakerId = players[fakerIndex].id;

    const currentQuestion = {
      question: randomQuestion.question,
      fakerPrompt: randomPrompt,
      fakerId
    };

    set(ref(database, `rooms/${roomCode}/currentQuestion`), currentQuestion);

    // Navigate to the question screen
    navigate("/question", {
      state: {
        roomCode,
        playerId
      }
    });
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
