'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import UserList from '@/components/UserList';
import ChatWindow from '@/components/ChatWindow';
import InsightsPanel from '@/components/InsightsPanel';

interface Conversation {
  id: number;
  name: string;
}

export default function DashboardPage() {
  const { isLoggedIn, user, logout } = useAuth();
  const router = useRouter();
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="flex justify-between items-center p-4 bg-white shadow-sm z-10 border-b border-gray-200">
        <h1 className="text-xl font-bold text-indigo-600">V.Connct Chat Hub</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 hidden sm:block font-medium">
            {user.name}
          </span>
          {/* --- ENHANCEMENT: Added user avatar --- */}
          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <button
            onClick={logout}
            className="p-2 text-gray-500 rounded-full hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Logout"
          >
            {/* --- ENHANCEMENT: Replaced text button with an icon --- */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* --- ENHANCEMENT: Main content area uses flex-1 to fill space --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* --- ENHANCEMENT: Defined fixed, responsive widths for sidebar --- */}
        <div
          className={`
            w-full md:w-80 lg:w-96 flex-shrink-0 
            bg-white border-r border-gray-200 
            overflow-y-auto flex-col 
            ${selectedConversation ? 'hidden md:flex' : 'flex'}
          `}
        >
          <UserList
            currentUserId={user.id}
            onSelectConversation={setSelectedConversation}
            selectedConversation={selectedConversation}
          />
        </div>

        <main
          className={`
            flex-1 bg-gray-50 flex flex-col
            ${selectedConversation ? 'flex' : 'hidden md:flex'}
          `}
        >
          {selectedConversation ? (
            <ChatWindow
              currentUserId={user.id}
              conversation={selectedConversation}
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            // --- ENHANCEMENT: Professional placeholder for empty chat window ---
            <div className="flex-1 items-center justify-center text-gray-500 hidden md:flex">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Select a conversation
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Choose from the list to start chatting.
                </p>
              </div>
            </div>
          )}
        </main>

        {/* --- ENHANCEMENT: Defined fixed width for insights, hidden below 'lg' --- */}
        <div className="w-80 flex-shrink-0 bg-white border-l border-gray-200 hidden lg:flex flex-col overflow-y-auto p-4">
          {selectedConversation ? (
            <InsightsPanel
              currentUserId={user.id}
              targetUserId={selectedConversation.id}
            />
          ) : (
            // --- ENHANCEMENT: Placeholder for empty insights panel ---
            <div className="flex-1 flex items-center justify-center text-center text-gray-500">
              <div>
                <svg
                  className="mx-auto h-10 w-10 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="mt-2 text-sm">
                  Select a conversation to view insights.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}