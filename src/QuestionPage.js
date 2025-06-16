import React, { useState } from 'react';

export default function QuestionPage() {
  const questions = [
    "How many children do you want?",
    "How many times a week do you exercise?",
    "What’s the ideal number of vacation days in a year?",
    "How many close friends do you have?",
    "What’s the perfect number of hours to sleep?",
    "How many cups of coffee do you drink per day?",
    "How many countries have you visited?",
    "What age do you want to retire at?",
    "How many pets would you like to have?",
    "How many times have you watched your favorite movie?"
  ];

  const getRandomQuestion = () => {
    const randomIndex = Math.floor(Math.random() * questions.length);
    return questions[randomIndex];
  };

  const [question, setQuestion] = useState(getRandomQuestion());

  const handleNext = () => {
    setQuestion(getRandomQuestion());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#b1b5de] px-4 text-center">
      <h2 className="text-3xl font-bold text-[#fef1dd] mb-8">{question}</h2>

      <button
        className="w-full max-w-md rounded-2xl bg-[#fef1dd] text-xl font-bold text-[#b1b5de] py-4"
        onClick={handleNext}
      >
        NEXT QUESTION
      </button>
    </div>
  );
}
