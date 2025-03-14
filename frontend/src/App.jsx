import React, { useState, useEffect } from 'react';

// Determine the API base URL using Vite's environment variables
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://openmanus-api:8000";
console.log("API Base URL:", apiBaseUrl);

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState("");

  // When the user submits a prompt, send it to the backend /run endpoint.
  const handleSubmit = async () => {
    setLoading(true);
    setResult("");
    try {
      console.log('API Base URL:', apiBaseUrl);
      console.log('Full URL:', apiBaseUrl + "/run");
      const res = await fetch(apiBaseUrl + "/run", {  // Using relative URL (see proxy config below)
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      console.log('Response status:', res.status);
      const data = await res.text(); // Change to .text() to see full response
      console.log('Response data:', data);
      try {
        const jsonData = JSON.parse(data);
        if (res.ok) {
          setResult(jsonData.result);
        } else {
          setResult(`Error: ${jsonData.detail || jsonData.error}`);
        }
      } catch (parseError) {
        setResult(`Parsing Error: ${parseError.message}\nRaw Response: ${data}`);
      }
    } catch (error) {
      setResult(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Set up Server-Sent Events to receive logs.
  useEffect(() => {
    const eventSource = new EventSource(apiBaseUrl + "/logs"); // proxy will forward to API service
    eventSource.onmessage = (event) => {
      setLogs(prev => prev + event.data + "\n");
    };
    eventSource.onerror = () => {
      console.error("SSE connection error.");
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Manus Web Interface
      </h1>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full h-14 resize-none rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-300 outline-none p-4 text-gray-700 bg-gray-50"
        placeholder="Enter your prompt here..."
      ></textarea>
      <button
        onClick={handleSubmit}
        className="mt-4 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md font-medium transition-colors duration-200"
        disabled={loading}
      >
        {loading ? "Processing..." : "Submit"}
      </button>
      <div className="mt-6">
        <h2 className="text-xl font-medium mb-2">Result:</h2>
        <pre className="bg-gray-50 rounded-md border border-gray-200 p-4 h-64 overflow-auto text-gray-700 whitespace-pre-wrap">
          {result}
        </pre>
      </div>
      <div className="mt-6">
        <h2 className="text-xl font-medium mb-2">Logs:</h2>
        <pre className="bg-gray-50 rounded-md border border-gray-200 p-4 h-64 overflow-auto text-gray-700 whitespace-pre-wrap">
          {logs}
        </pre>
      </div>
    </div>
  );
}

export default App;
