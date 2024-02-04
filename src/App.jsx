// App.jsx

import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';

const NavBar = ({ onAddApiKey }) => (
  <div className="navbar">
    <h1>QuineLaw</h1>
    <button onClick={onAddApiKey}>ADD API KEY</button>
  </div>
);

const Form = ({ country, situation, onCountryChange, onSituationChange, onGenerateResponse, isLoading }) => (
  <div className="container">
    <label>Select Country:</label>
    <select value={country} onChange={(e) => onCountryChange(e.target.value)}>
      <option value="">Select Country</option>
      <option value="India">India</option>
      <option value="USA">USA</option>
      {/* Add more countries as needed */}
    </select>
    <br />
    <label>Describe the Legal Situation:</label>
    <textarea
      rows="4"
      cols="50"
      value={situation}
      onChange={(e) => onSituationChange(e.target.value)}
    ></textarea>
    <br />
    <button onClick={onGenerateResponse} disabled={isLoading}>
      Generate Response
    </button>
    {isLoading && <p className="loading">Loading...</p>}
  </div>
);

const Response = ({ response }) => (
  <div className="container">
    <h2>AI Response:</h2>
    <ul>{response}</ul>
  </div>
);

const App = () => {
  const [apiKey, setApiKey] = useState('');
  const [situation, setSituation] = useState('');
  const [country, setCountry] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const genAI = new GoogleGenerativeAI(apiKey);
  

  const handleGenerateResponse = async () => {
    try {
      setIsLoading(true);

      if (!genAI) {
        console.error('Invalid key');
        return;
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `You are a quick guidance for any law violation or government rule break for ${country} country, the information is just for education and awareness purpose and accessed by citizens. Provide (1) relevant rule or law mentioned in the ${country} government law/rule book, (2) Charges/fine/actions against the guilty according to the law, (3) Personal advice on what to do if found guilty and how to proceed further. The scenario is ${situation}`;

      const result = await model.generateContent(prompt);
      const generatedResponse = await result.response.text();

      // Format the response in points
      const formattedResponse = generatedResponse.split('\n').map((point, index) => <li key={index}>{point}</li>);

      setResponse(formattedResponse);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = () => {
    setShowApiKeyInput(false);
  };

  const handleAddApiKey = () => {
    setShowApiKeyInput(true);
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
  };

  return (
    <div>
      <NavBar onAddApiKey={handleAddApiKey} />
      {showApiKeyInput && (
        <div className="api-key-input container">
          <label>Enter API Key:</label>
          <input type="text" value={apiKey} onChange={handleApiKeyChange} />
          <button onClick={handleSaveApiKey}>Save</button>
          <button onClick={() => setShowApiKeyInput(false)}>Cancel</button>
        </div>
      )}
      <Form
        country={country}
        situation={situation}
        onCountryChange={setCountry}
        onSituationChange={setSituation}
        onGenerateResponse={handleGenerateResponse}
        isLoading={isLoading}
      />
      {response && <Response response={response} />}
    </div>
  );
};

export default App;
