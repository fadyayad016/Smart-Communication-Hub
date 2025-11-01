'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io, { Socket } from 'socket.io-client';

const API_URL = 'http://localhost:3000';

interface User {
  id: number;
  name: string;
}

interface Conversation {
  id: number;
  name: string;
}

interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  text: string;
  timestamp: string;
  sender: User;
}

interface ChatWindowProps {
  currentUserId: number;
  conversation: Conversation;
  onBack: () => void;
}

let socket: Socket | null = null;

export default function ChatWindow({
  currentUserId,
  conversation,
  onBack,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Message[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const targetUserId = conversation.id;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/api/messages/conversation`,
          {
            params: { targetUserId },
          },
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch conversation history:', error);
      }
    };

    if (!socket) {
      socket = io(API_URL);
    }

    socket.emit('register_socket', currentUserId);

    const handleNewMessage = (message: Message) => {
      const relevant =
        (message.senderId === currentUserId &&
          message.receiverId === targetUserId) ||
        (message.senderId === targetUserId &&
          message.receiverId === currentUserId);

      if (relevant) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('new_message', handleNewMessage);

    fetchHistory();

    return () => {
      socket?.off('new_message', handleNewMessage);
    };
  }, [currentUserId, targetUserId]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery) {
        setSearchResults(null); 
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await axios.get(
          `${API_URL}/api/messages/search`, 
          {
            params: {
              targetUserId: targetUserId,
              q: debouncedQuery,
            },
          },
        );
        setSearchResults(response.data);
      } catch (error) {
        console.error('Failed to search messages:', error);
        setSearchResults([]); 
      }
      setIsSearching(false);
    };

    performSearch();
  }, [debouncedQuery, targetUserId]);

  useEffect(() => {
    if (searchResults === null) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, searchResults]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socket) return;

    const messagePayload = {
      senderId: currentUserId,
      message: {
        receiverId: targetUserId,
        text: inputText.trim(),
      },
    };

    socket.emit('send_message', messagePayload);


    setInputText('');
  };

  const messagesToDisplay = searchResults !== null ? searchResults : messages;

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-white border-b border-gray-200 flex flex-col gap-4 sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="md:hidden p-2 rounded-full hover:bg-gray-100 text-gray-600"
            aria-label="Back to conversations"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center">
            <span className="font-semibold text-lg">
              {conversation.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <h2 className="text-lg font-bold text-gray-800">
            {conversation.name}
          </h2>
        </div>

        <div className="relative w-full">
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search in conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-100 border border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
              aria-label="Clear search"
            >
              <ClearIcon />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isSearching && (
          <div className="text-center text-gray-500 py-4">Searching...</div>
        )}

        {!isSearching &&
          searchResults !== null &&
          searchResults.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              No results found for "{debouncedQuery}"
            </div>
          )}

        {!isSearching &&
          searchResults !== null &&
          searchResults.length > 0 && (
            <div className="text-center text-gray-500 py-2 text-sm">
              Found {searchResults.length} matching message(s)
            </div>
          )}

        {messagesToDisplay.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === currentUserId ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md ${
                message.senderId === currentUserId
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-tl-none'
              }`}
            >
              <p className="break-words">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block text-right">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-4 bg-gray-50 border-t border-gray-200 flex items-center space-x-3 sticky bottom-0"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
        />
        <button
          type="submit"
          className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:bg-indigo-400 transition-all duration-150 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={!inputText.trim()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 transform rotate-45"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ClearIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);
