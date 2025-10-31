'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  RefreshCw,
  Zap,
  TrendingUp,
  TrendingDown,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';

const API_URL = 'http://localhost:3000';

interface Insight {
  summary: string;
  sentiment: string;
}

interface InsightsPanelProps {
  currentUserId: number;
  targetUserId: number;
}

export default function InsightsPanel({
  currentUserId,
  targetUserId,
}: InsightsPanelProps) {
  const [insight, setInsight] = useState<Insight | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInsight = async (generate = false) => {
    setLoading(true);
    setError(null);
    try {
      const endpoint = generate ? 'generate' : '';
      let response;

      if (generate) {
        response = await axios.post(
          `${API_URL}/api/insights/${endpoint}`,
          {},
          { params: { targetUserId } }
        );
      } else {
        response = await axios.get(
          `${API_URL}/api/insights/${endpoint}?targetUserId=${targetUserId}`
        );
      }

      setInsight(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setInsight(null);
      } else {
        setError('Failed to load insights.');
        console.error('Insights error:', err);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInsight(null);
    fetchInsight();
  }, [targetUserId]);

  const handleGenerate = () => {
    fetchInsight(true);
  };

  const getSentimentIcon = (sentiment: string) => {
    const lowerSentiment = sentiment.toLowerCase();
    if (lowerSentiment.includes('positive')) {
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    }
    if (lowerSentiment.includes('negative')) {
      return <TrendingDown className="w-5 h-5 text-red-600" />;
    }
    return <Zap className="w-5 h-5 text-yellow-600" />;
  };

  const LoadingState = () => (
    <div className="flex items-center justify-center p-6 text-gray-500">
      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
      <span>Generating insights...</span>
    </div>
  );

  const ErrorState = () => (
    <div className="flex p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
      <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
      <span className="text-sm">{error}</span>
    </div>
  );

  const EmptyState = () => (
    <div className="flex p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-700">
      <Lightbulb className="w-5 h-5 mr-2 flex-shrink-0 text-gray-400" />
      <span className="text-sm">
        No insights available. Click below to generate.
      </span>
    </div>
  );

  const SuccessState = () => (
    <div className="space-y-6">
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Summary
        </h4>
        <p className="text-sm text-gray-800 leading-relaxed">
          {insight!.summary}
        </p>
      </div>

      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
          Sentiment
        </h4>
        <div className="flex items-center space-x-2">
          {getSentimentIcon(insight!.sentiment)}
          <span
            className={`font-bold ${
              insight!.sentiment.includes('Positive')
                ? 'text-green-600'
                : insight!.sentiment.includes('Negative')
                ? 'text-red-600'
                : 'text-yellow-600'
            }`}
          >
            {insight!.sentiment}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col bg-white">
      <h3 className="p-4 text-lg font-bold flex items-center text-indigo-700 border-b border-gray-200">
        <Zap className="w-5 h-5 mr-2" />
        AI Conversation Insights
      </h3>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState />
          ) : insight ? (
            <SuccessState />
          ) : (
            <EmptyState />
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full px-4 py-2 flex items-center justify-center space-x-2 text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 transition"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{insight ? 'Regenerate Insights' : 'Generate Insights'}</span>
        </button>
      </div>
    </div>
  );
}