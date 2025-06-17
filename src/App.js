import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CreatePage from './CreatePage';
import JoinPage from './JoinPage';
import GamePage from './GamePage';
import QuestionPage from './QuestionPage';
import RoomLobby from './RoomLobby';
import GameSelectPage from './GameSelectPage'; // Add this at the top




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreatePage />} />
        <Route path="/join" element={<JoinPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/question" element={<QuestionPage />} />
        <Route path="/lobby" element={<RoomLobby />} />
        <Route path="/gameselect" element={<GameSelectPage />} />


      </Routes>
    </Router>
  );
}

export default App;
