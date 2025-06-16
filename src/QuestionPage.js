import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { database } from './firebase';
import { ref, onValue } from 'firebase/database';

export default function QuestionPage() {
  const location = useLocation();
  const { roomCode, playerId } = location.state || {};

  const [questionData, setQuestionData] = useState(null);

  useEffect(() => {
    if (!roomCode) return;

    const questionRef = ref(database, 'rooms/' + roomCode + '/currentQuestion');

    const unsubscribe = onValue(questionRef, (snapshot) => {
      if (snapshot.exists()) {
        setQuestionData(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, [roomCode]);

  if (!questionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#b1b5de] text-[#fef1dd] text-2xl">
        Waiting for question...
      </div>
    );
  }

  const isFaker = questionData.fakerId === playerId;
  const displayText = isFaker ? questionData.fakerPrompt : questionData.question;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#b1b5de] px-4 text-center">
      <h1 className="text-3xl font-bold text-[#fef1dd] mb-8">Question</h1>
      <p className="text-2xl text-[#fef1dd] mb-8">{displayText}</p>

      <p className="text-md text-[#fef1dd] opacity-70">
        {isFaker ? "You are the faker. Blend in!" : "Answer like you normally would."}
      </p>
    </div>
  );
}
