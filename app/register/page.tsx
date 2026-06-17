"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [candidateName, setCandidateName] = useState("");
  const [examinerName, setExaminerName] = useState("");

  const startTest = async () => {
    if (!candidateName || !examinerName) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem("candidateName", candidateName);
    localStorage.setItem("examinerName", examinerName);
    localStorage.setItem("startTime", new Date().toISOString());

    router.push("/test");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Flyway Test Registration</h1>

      <input
        placeholder="Candidate Name"
        value={candidateName}
        onChange={(e) => setCandidateName(e.target.value)}
        style={{ display: "block", margin: 10, padding: 10 }}
      />

      <input
        placeholder="Examiner Name"
        value={examinerName}
        onChange={(e) => setExaminerName(e.target.value)}
        style={{ display: "block", margin: 10, padding: 10 }}
      />

      <button onClick={startTest} style={{ padding: 10 }}>
        Start Test
      </button>
    </div>
  );
}