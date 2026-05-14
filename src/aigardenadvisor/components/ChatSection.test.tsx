'use client';

import React from 'react';

interface ChatSectionProps {
  onOpenJournal?: () => void;
}

export const ChatSection: React.FC<ChatSectionProps> = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Agricultural AI Assistant</h1>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <p className="text-lg text-gray-700">
            Welcome to your Advanced Agricultural AI Assistant! This is a test component to verify the export is working.
          </p>
        </div>
      </div>
    </div>
  );
};
