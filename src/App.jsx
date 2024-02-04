// App.jsx

import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './App.css';
import Markdown from 'react-markdown'

const NavBar = ({ onAddApiKey }) => (
  <div className="navbar">
    <div><h1>Quine<span style={{color : 'green'}}>Law</span></h1></div>
    <button onClick={onAddApiKey}>Add Api key</button>
  </div>
);

const Form = ({ country, situation, onCountryChange, onSituationChange, onGenerateResponse, isLoading }) => (
  <div className="container" >
    <label>Select Country:</label>
    <select value={country} onChange={(e) => onCountryChange(e.target.value)}>
      <option value="" id='selectdefault'>Select Country</option>
      <option value="Africa">Africa</option>
      <option value="Brazil">Brazil</option>
      <option value="Bangladesh">Bangladesh</option>
      <option value="China">China</option>
      <option value="Democratic Republic of the Congo">Democratic Republic of the Congo</option>
      <option value="Europe">Europe</option>
      <option value="France">France</option>
      <option value="Germany">Germany</option>
      <option value="India">India</option>
      <option value="Japan">Japan</option>
      <option value="Korea, North">Korea, North</option>
      <option value="Liberia">Liberia</option>
      <option value="Mexico">Mexico</option>
      <option value="Nigeria">Nigeria</option>
      <option value="Oman">Oman</option>
      <option value="Pakistan">Pakistan</option>
      <option value="Qatar">Qatar</option>
      <option value="Russia">Russia</option>
      <option value="Saudi Arabia">Saudi Arabia</option>
      <option value="Turkey">Turkey</option>
      <option value="United Kingdom">United Kingdom</option>
      <option value="United States of America">United States of America</option>
      <option value="Vietnam">Vietnam</option>
      <option value="Yemen">Yemen</option>
      <option value="Zambia">Zambia</option>
      
      
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

const Response = ({ response, isResponseAvailable }) => (
  <div className="container">
    <h2>QuineLaw says:</h2>
    <ul><Markdown>{response}</Markdown></ul>
    {isResponseAvailable && (
        <button  className="download-button">
          Download as PDF
        </button>
      )}
  </div>
);

const App = () => {
  const [apiKey, setApiKey] = useState('');
  const [situation, setSituation] = useState('');
  const [country, setCountry] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [isResponseAvailable, setIsResponseAvailable] = useState(false);
  const genAI = new GoogleGenerativeAI(apiKey);
  

  const handleGenerateResponse = async () => {
    try {
      setIsLoading(true);

      if (!genAI) {
        console.error('Invalid key');
        return;
      }

      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `You are a quick guidance for any law violation or government rule break for ${country} country, the information is just for education and awareness purpose and accessed by citizens. Provide (1) law mentioned in the ${country} government law/rule book, (2) Charges/fine/actions against the guilty according to the law, (3) Personal advice on what to do if found guilty and how to proceed further. The scenario is ${situation}.`

      const result = await model.generateContent(prompt);
      const generatedResponse = await result.response.text();

      setResponse(generatedResponse);
      setIsResponseAvailable(true);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeveloperApiKey = () =>{
    setShowApiKeyInput(false);
    setApiKey(process.env.VITE_API_KEY)
  }

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
          <button style={{margin : 20 }} onClick={handleDeveloperApiKey}>Use Developer's Api :( </button>
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
      {response && <Response response={response} isResponseAvailable={isResponseAvailable} />}
    </div>
  );
};

export default App;
