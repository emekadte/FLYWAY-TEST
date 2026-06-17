"use client";

import { useEffect, useState } from "react";

export default function ResultPage() {
  const [score, setScore] = useState("0");

  useEffect(() => {
    const s = localStorage.getItem("finalScore") || "0";
    setScore(s);
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Test Completed</h1>

      <h2>Your Score:</h2>
      <h1>{score}%</h1>

      <p>The test has now ended.</p>
    </div>
  );
}