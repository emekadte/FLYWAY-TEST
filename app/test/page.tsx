"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function TestPage() {
  const router = useRouter();

  const [questions, setQuestions] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(20 * 60);

  const candidateId =
    typeof window !== "undefined"
      ? localStorage.getItem("candidateId")
      : null;

  const sessionId =
    typeof window !== "undefined"
      ? localStorage.getItem("sessionId")
      : null;

  // =========================
  // LOAD QUESTIONS (STABLE VERSION)
  // =========================
  useEffect(() => {
    const loadQuestions = async () => {
      const { data, error } = await supabase
        .from("questions")
        .select("*, options(*)");

      if (error) {
        console.error("Questions load error:", error);
        setLoading(false);
        return;
      }

      setQuestions(data || []);
      setLoading(false);
    };

    loadQuestions();
  }, []);

  // =========================
  // TIMER
  // =========================
  useEffect(() => {
    if (timeLeft <= 0) {
      finishExam();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // =========================
  // ANSWER SELECT
  // =========================
  const selectAnswer = async (questionId: number, option: any) => {
    if (!candidateId || !sessionId) return;

    await supabase.from("candidate_answers").insert({
      candidate_id: candidateId,
      session_id: sessionId,
      question_id: questionId,
      option_id: option.id,
    });

    const next = index + 1;

    if (next < questions.length) {
      setIndex(next);
    } else {
      finishExam();
    }
  };

  // =========================
  // FINISH EXAM
  // =========================
  const finishExam = async () => {
    if (!candidateId || !sessionId) return;

    const { data: answers } = await supabase
      .from("candidate_answers")
      .select("*, options(score)")
      .eq("candidate_id", candidateId)
      .eq("session_id", sessionId);

    const totalScore = (answers || []).reduce(
      (sum: number, a: any) => sum + (a.options?.score || 0),
      0
    );

    const maxScore = questions.length * 5;
    const percent = Math.round((totalScore / maxScore) * 100);

    localStorage.setItem("finalScore", percent.toString());

    router.push("/result");
  };

  // =========================
  // LOADING STATE
  // =========================
  if (loading) {
    return (
      <div className="container">
        <div className="card">Loading questions...</div>
      </div>
    );
  }

  // =========================
  // EMPTY STATE (SAFE GUARD)
  // =========================
  if (!questions.length) {
    return (
      <div className="container">
        <div className="card">
          No exam questions found. Please check database.
        </div>
      </div>
    );
  }

  const current = questions[index];

  if (!current) {
    return (
      <div className="container">
        <div className="card">
          Loading question...
        </div>
      </div>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="container">
      <div className="card">

        <h1 className="title">FLYWAY DATABASE TEST</h1>

        <div style={{ color: "red", fontSize: "18px", marginBottom: "10px" }}>
          Time Left: {formatTime(timeLeft)}
        </div>

        <h2>
          Question {index + 1} / {questions.length}
        </h2>

        <p className="subtitle">{current.question}</p>

        {current.options?.map((opt: any) => (
          <div
            key={opt.id}
            className="option"
            onClick={() => selectAnswer(current.id, opt)}
            style={{
              padding: "12px",
              margin: "8px 0",
              border: "1px solid #ccc",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            {opt.option_text}
          </div>
        ))}

      </div>
    </div>
  );
}