import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { database } from './firebase';
import { ref, onValue, push, set } from 'firebase/database';

export default function RoomLobby() {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomCode, playerId } = location.state || {};

  const [players, setPlayers] = useState([]);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    if (!roomCode || !playerId) return;

    const playersRef = ref(database, 'rooms/' + roomCode + '/players');
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const playerList = Object.entries(data).map(([id, info]) => ({
        id,
        name: info.name
      }));
      setPlayers(playerList);

      const currentPlayer = playerList.find((p) => p.id === playerId);
      setIsHost(currentPlayer?.isHost || false);
    });

    return () => unsubscribe();
  }, [roomCode, playerId]);

  const handleNextQuestion = async () => {
    if (!roomCode) return;

    const fakerIndex = Math.floor(Math.random() * players.length);
    const fakerId = players[fakerIndex]?.id;

    const sampleQuestion = {
      question: "How many hours do you sleep?",
      fakerPrompt: "How many apps do you use daily?",
      fakerId: fakerId,
      timestamp: Date.now()
    };

    const questionRef = ref(database, 'rooms/' + roomCode + '/currentQuestion');
    await set(questionRef, sampleQuestion);

    navigate('/question', { state: { roomCode, playerId } });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#b1b5de] px-4 text-center">
      <h2 className="text-3xl font-bold text-[#fef1dd] mb-8">Room Code: {roomCode}</h2>

      <ul className="mb-8 text-[#fef1dd] text-xl">
        {players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>

      {isHost && (
        <button
          onClick={handleNextQuestion}
          className="rounded-2xl bg-[#fef1dd] text-xl font-bold text-[#b1b5de] py-4 px-8"
        >
          Next Question
        </button>
      )}
    </div>
  );
}
