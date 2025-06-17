import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ref, onValue } from "firebase/database";
import { database } from "./firebase";

function RoomLobby() {
  const navigate = useNavigate();
  const location = useLocation();
  const { roomCode, playerId } = location.state || {};
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (!roomCode) return;

    const playersRef = ref(database, `rooms/${roomCode}/players`);
    onValue(playersRef, (snapshot) => {
      const data = snapshot.val() || {};
      const playerList = Object.values(data);
      setPlayers(playerList);
    });

    const qIndexRef = ref(database, `rooms/${roomCode}/questionIndex`);
    onValue(qIndexRef, (snapshot) => {
      if (snapshot.exists()) {
        navigate("/question", { state: { roomCode, playerId } });
      }
    });
  }, [roomCode, playerId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center font-sans">
      <h1 className="text-3xl font-bold mb-4">Who's Playing?</h1>
      <ul className="text-lg">
        {players.map((name, idx) => (
          <li key={idx}>{name}</li>
        ))}
      </ul>
      <p className="mt-6 text-gray-500 italic">Waiting for the host to start…</p>
    </div>
  );
}

export default RoomLobby;
