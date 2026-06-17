"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const questions = [
  {
    question: "What is Flyway used for?",
    options: [
      { text: "Database migration tool", score: 5 },
      { text: "Frontend framework", score: 0 },
      { text: "Cloud storage system", score: 0 },
      { text: "AI model trainer", score: 0 }
    ]
  },
  {
    question: "Flyway migrations are usually:",
    options: [
      { text: "Randomly executed", score: 0 },
      { text: "Version controlled", score: 5 },
      { text: "Deleted after use", score: 0 },
      { text: "Stored in cache only", score: 0 }
    ]
  },
  {
    question: "Flyway integrates well with:",
    options: [
      { text: "CI/CD pipelines", score: 5 },
      { text: "Gaming engines", score: 0 },
      { text: "Photo editors", score: 0 },
      { text: "Music apps", score: 0 }
    ]
  }
];

export default function TestPage() {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);

  const current = questions[index];

  const selectAnswer = (option: any) => {
    setScore(score + option.score);

    if (index + 1 < questions.length) {
      setIndex(index + 1);
    } else {
      const percent = (score / (questions.length * 5)) * 100;

      localStorage.setItem("finalScore", percent.toString());

      router.push("/result");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Question {index + 1}</h2>

      <h3>{current.question}</h3>

      {current.options.map((opt, i) => (
        <button
          key={i}
          onClick={() => selectAnswer(opt)}
          style={{ display: "block", margin: 10, padding: 10 }}
        >
          {opt.text}
        </button>
      ))}
    </div>
  );
}