"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ResultPage() {
  const [score, setScore] = useState("0");
  const router = useRouter();

  useEffect(() => {
    const finalizeExam = async () => {
      const finalScore = localStorage.getItem("finalScore") || "0";
      const sessionId = localStorage.getItem("sessionId");

      setScore(finalScore);

      // If session exists, update DB (production-ready behavior)
      if (sessionId) {
        await supabase
          .from("exam_sessions")
          .update({
            score: Number(finalScore),
            status: "COMPLETED",
            ended_at: new Date().toISOString()
          })
          .eq("id", sessionId);
      }
    };

    finalizeExam();
  }, []);

  const restartTest = async () => {
    const candidateId = localStorage.getItem("candidateId");

    // Optional: create new session (better than just clearing state)
    if (candidateId) {
      await supabase.from("exam_sessions").insert({
        candidate_id: candidateId,
        status: "IN_PROGRESS"
      });
    }

    // clear local session cache
    localStorage.removeItem("finalScore");
    localStorage.removeItem("sessionId");

    router.push("/register");
  };

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center" }}>

        <h1 className="title">EXAM COMPLETED</h1>

        <h2 style={{ fontSize: "48px", color: "#00ff88" }}>
          {score}%
        </h2>

        <p className="subtitle">
          Your submission has been recorded
        </p>

        <button
          onClick={restartTest}
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            cursor: "pointer",
            background: "#00ff88",
            border: "none",
            borderRadius: "8px",
            fontWeight: "bold"
          }}
        >
          Restart Test
        </button>

      </div>
    </div>
  );
}