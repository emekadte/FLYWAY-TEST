"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center" }}>
        
        <h1 className="title">FLYWAY DATABASE TEST</h1>
        <p className="subtitle">Assessment Platform</p>

        <button
          className="button"
          onClick={() => router.push("/register")}
          style={{
            marginTop: "20px",
            padding: "12px 24px",
            fontSize: "16px",
            cursor: "pointer"
          }}
        >
          START
        </button>

      </div>
    </div>
  );
}