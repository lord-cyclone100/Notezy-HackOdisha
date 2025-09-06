import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { BACKEND_URL } from '../config/config';
import { QuestionCard } from '../components/elements/QuestionCard';

// Define interfaces
interface QuestionSet {
  _id: string;
  title?: string;
  questions: string[];
  created_at: string;
  // Add other properties as needed
}

export const Questions = () => {
  const { isAuthenticated } = useAuth();
  const [questions, setQuestions] = useState<QuestionSet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchQuestions();
    }
  }, [isAuthenticated]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}questions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setQuestions(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to fetch questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuestions = async (questionsId: string) => {
    if (!window.confirm('Are you sure you want to delete these questions?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}questions/${questionsId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove the deleted questions from the state
      setQuestions(questions.filter(q => q._id !== questionsId));
    } catch (error) {
      console.error('Error deleting questions:', error);
      alert('Failed to delete questions. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            Access Denied
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Please log in to view your questions.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-lg font-medium text-gray-600 dark:text-gray-300">
            Loading your questions...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Questions
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Study questions generated from your notes
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {questions.length} question set{questions.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex">
              <svg className="w-5 h-5 text-red-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="ml-3">
                <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Questions Grid */}
        {questions.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No questions yet
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Generate questions from your notes to start studying!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {questions.map((questionSet) => (
              <QuestionCard 
                key={questionSet._id} 
                questions={{
                  _id: questionSet._id,
                  title: questionSet.title || '',
                  note_title: questionSet.title || '',
                  content: (questionSet.questions || []).join('\n'),
                  created_at: questionSet.created_at
                }}
                onDelete={handleDeleteQuestions}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
