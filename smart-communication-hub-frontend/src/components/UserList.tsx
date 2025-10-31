'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import io, { Socket } from 'socket.io-client';

const API_URL = 'http://localhost:3000';
let socket: Socket | null = null;

interface User {
  id: number;
  name: string;
  email: string;
}

interface Conversation {
  id: number;
  name: string;
}

interface UserListProps {
  currentUserId: number;
  onSelectConversation: (conversation: Conversation) => void;
  selectedConversation: Conversation | null;
}

export default function UserList({
  currentUserId,
  onSelectConversation,
  selectedConversation,
}: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!socket) {
      socket = io(API_URL);
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/users`);
        const otherUsers = response.data.filter(
          (u: User) => u.id !== currentUserId
        );
        setUsers(otherUsers);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();

    socket.on('user_online', (userId: number) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socket.on('user_offline', (userId: number) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    });

    return () => {
      socket?.off('user_online');
      socket?.off('user_offline');
    };
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading users...</div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-2 space-y-1">
      <h3 className="px-4 pt-3 pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
        Available Users
      </h3>

      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => onSelectConversation({ id: user.id, name: user.name })}
          className={`p-3 mx-2 cursor-pointer rounded-lg transition duration-150 flex items-center justify-between 
            ${
              selectedConversation?.id === user.id
                ? 'bg-indigo-100 border-l-4 border-indigo-600 font-semibold'
                : 'hover:bg-gray-50' 
            }
          `}
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-indigo-500 text-white flex items-center justify-center rounded-full text-base font-bold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              {onlineUsers.has(user.id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></span>
              )}
            </div>

            <div>
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        </div>
      ))}
      {users.length === 0 && (
        <p className="p-6 text-center text-gray-500">
          No other users registered.
        </p>
      )}
    </div>
  );
}