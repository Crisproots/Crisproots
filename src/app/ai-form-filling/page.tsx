"use client";

import { useEffect, useState } from "react";

export default function AIFormFillingPage() {
  const [backendStatus, setBackendStatus] = useState<'checking' | 'running' | 'not-running'>('checking');
  const backendUrl = "http://localhost:5005";

  useEffect(() => {
    fetch(backendUrl, { method: 'GET' })
      .then(() => setBackendStatus('running'))
      .catch(() => setBackendStatus('not-running'));
  }, []);

  if (backendStatus === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Checking AI Form Filling Service...</h1>
          <div className="mt-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (backendStatus === 'running') {
    return (
      <div className="min-h-screen bg-white">
        <div className="bg-green-700 text-white p-4">
          <h1 className="text-2xl font-bold text-center">AI Form Filling System</h1>
        </div>
        <iframe
          src={backendUrl}
          className="w-full h-[calc(100vh-64px)] border-0"
          title="AI Form Filling Interface"
          allow="camera; microphone; clipboard-write"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-green-800 mb-6 text-center">
            AI Form Filling
          </h1>
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              About AI Form Filling
            </h2>
            <p className="text-gray-600 mb-6">
              Our AI-powered Form Filling system helps users fill out government forms easily with voice assistance in English or Hindi. Start the backend service to use the form filling assistant.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Key Features:
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>Voice-guided form filling in English and Hindi</li>
              <li>Smart field detection and validation</li>
              <li>Photo, signature, and document capture</li>
              <li>Draft saving and resume support</li>
              <li>Easy navigation between schemes and forms</li>
            </ul>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Quick Start:</strong> To run the AI Form Filling service, you need to start the backend:
              </p>
              <div className="mt-2 bg-gray-800 text-white p-3 rounded font-mono text-sm">
                <div># Navigate to the ai-form-filling directory</div>
                <div>cd src/app/ai-form-filling</div>
                <div># Install dependencies (first time only)</div>
                <div>npm install</div>
                <div># Start the backend server</div>
                <div>npm run dev</div>
              </div>
              <p className="text-sm text-blue-800 mt-2">
                The service typically runs on http://localhost:5005. Once started, refresh this page to access the interface.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a
                href="/"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Back to Home
              </a>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Check Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
