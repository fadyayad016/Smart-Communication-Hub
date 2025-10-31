'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
// --- ENHANCEMENT: Added icons for inputs, errors, and loading ---
import { Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

const API_URL = 'http://localhost:3000/api/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  // --- ENHANCEMENT: Added loading state for form submission ---
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true); // --- ENHANCEMENT: Set loading true
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { access_token, user } = response.data;
      login(access_token, user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Check credentials.');
      setLoading(false); // --- ENHANCEMENT: Set loading false on error
    }
    // No need to set loading false on success, as the page will redirect
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      {/* --- ENHANCEMENT: Added rounded-xl and increased shadow --- */}
      <div className="max-w-md w-full p-8 space-y-8 bg-white shadow-xl rounded-xl">
        {/* --- ENHANCEMENT: Increased title size --- */}
        <h2 className="text-3xl font-bold text-center text-indigo-600">
          Sign In to V.Connct
        </h2>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* --- ENHANCEMENT: Input field with icon --- */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="email"
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading} // --- ENHANCEMENT: Disable while loading
              className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            />
          </div>

          {/* --- ENHANCEMENT: Input field with icon --- */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-gray-400" />
            </span>
            <input
              type="password"
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading} // --- ENHANCEMENT: Disable while loading
              className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-sm"
            />
          </div>

          {/* --- ENHANCEMENT: Improved error display with icon --- */}
          {error && (
            <div className="flex items-center p-3 space-x-2 text-sm text-red-700 bg-red-50 rounded-md border border-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading} // --- ENHANCEMENT: Disable while loading
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all"
          >
            {/* --- ENHANCEMENT: Show spinner when loading --- */}
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* --- ENHANCEMENT: Made link text smaller --- */}
        <div className="text-sm text-center">
          <a
            href="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Don't have an account? Register
          </a>
        </div>
      </div>
    </div>
  );
}