import React, { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [template, setTemplate] = useState("default");
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch("http://localhost:2525/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        subject: subject,
        template: template,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Email sent successfully!");
      setError("");
    } else {
      setError(result.errors.map((err) => err.msg).join(", "));
    }
  };

  return (
    <div>
      <h1>Email Newsletter Generator</h1>
      <form onSubmit={handleSubmit}>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Template:</label>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
          >
            <option value="welcome">Welcome</option>
            <option value="promotion">Promotion</option>
            <option value="default">Default</option>
          </select>
        </div>
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
}

export default App;
