import React, { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [emailError, setEmailError] = useState("");
  const [contentError, setContentError] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const validateForm = () => {
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError("");
    }
    if (!content) {
      setContentError("Content cannot be empty.");
      isValid = false;
    } else {
      setContentError("");
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:5000/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            content: content,
          }),
        });

        const result = await response.text();
        if (response.ok) {
          setResponseMessage("Newsletter sent successfully!");
        } else {
          setResponseMessage(`Error: ${result}`);
        }
      } catch (error) {
        setResponseMessage("Error sending newsletter.");
        console.error("Error:", error);
      }
    }
  };

  return (
    <div className="App">
      <h1>Email Newsletter Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {emailError && <p className="error">{emailError}</p>}
        </div>
        <div>
          <label>Content:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          {contentError && <p className="error">{contentError}</p>}
        </div>
        <button type="submit">Send Newsletter</button>
        {responseMessage && <p className="response">{responseMessage}</p>}
      </form>
    </div>
  );
}

export default App;
