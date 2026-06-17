"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function RegisterPage() {
  const router = useRouter();

  const [candidateName, setCandidateName] = useState("");
  const [examinerName, setExaminerName] = useState("");

  const startTest = async () => {
    if (!candidateName || !examinerName) {
      alert("Fill all fields");
      return;
    }

    // 1. create candidate
    const { data: candidate, error: candidateError } = await supabase
      .from("candidates")
      .insert({
        name: candidateName,
        examiner_name: examinerName
      })
      .select()
      .single();

    if (candidateError) {
      console.error(candidateError);
      alert("Failed to create candidate");
      return;
    }

    // 2. create exam session
    const { data: session, error: sessionError } = await supabase
      .from("exam_sessions")
      .insert({
        candidate_id: candidate.id,
        status: "IN_PROGRESS"
      })
      .select()
      .single();

    if (sessionError) {
      console.error(sessionError);
      alert("Failed to create session");
      return;
    }

    // store session locally (temporary cache)
    localStorage.setItem("candidateId", candidate.id);
    localStorage.setItem("sessionId", session.id);

    router.push("/test");
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="title">FLYWAY DATABASE TEST</h1>
        <p className="subtitle">Candidate Registration Portal</p>

        <input
          className="input"
          placeholder="Candidate Name"
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
        />

        <input
          className="input"
          placeholder="Examiner Name"
          value={examinerName}
          onChange={(e) => setExaminerName(e.target.value)}
        />

        <button className="button" onClick={startTest}>
          Start Assessment
        </button>
      </div>
    </div>
  );
}