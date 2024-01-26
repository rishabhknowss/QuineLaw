import React, { useState, useEffect } from 'react';

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/pile-of-law/legalbert-large-1.7M-2",
    {
      headers: { Authorization: "Bearer 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" },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  return result;
}

function App() {
  const [userInput, setUserInput] = useState('');
  const [apiResponse, setApiResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = { inputs: userInput };
      const response = await query(data);
      setApiResponse(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return (
    <div>
      <h1>Quine law</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Enter your question:
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
          />
        </label>
        <button type="submit">Submit</button>
      </form>

      <div>
        <h2>API Response:</h2>
        {apiResponse ? (
          <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
        ) : (
          <p>No response yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
