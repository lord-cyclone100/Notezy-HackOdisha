import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config/config"
import { useAuth } from '../context/AuthContext';
import { TestCard } from '../components/elements/TestCard';

type Test = {
  _id: string;
  title: string;
  test_content: string;
  created_at: string;
  // add other properties as needed
  [key: string]: any;
};

export const Tests = () => {
  const { user, isAuthenticated } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchTests();
    }
  }, [isAuthenticated]);

  const fetchTests = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}tests`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTests(response.data.tests || []);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setError('Failed to load tests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTest = async (testId: any) => {
    if (!window.confirm('Are you sure you want to delete this test?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}tests/${testId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove the deleted test from the state
      setTests(tests.filter(test => test._id !== testId));
    } catch (error) {
      console.error('Error deleting test:', error);
      alert('Failed to delete test. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-400">Please log in to view your tests.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">My Tests</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Welcome back, {user?.name}! Here are your generated practice tests.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-4 text-slate-600 dark:text-slate-400">Loading your tests...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchTests}
              className="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Tests Grid */}
        {!isLoading && !error && (
          <>
            {tests.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">No Tests Yet</h3>
                  <p className="text-slate-500 dark:text-slate-500 mb-4">
                    You haven't generated any tests yet. Go to your notes and select some to create your first practice test.
                  </p>
                  <a 
                    href="/notes" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Go to My Notes
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-slate-600 dark:text-slate-400">
                    {tests.length} {tests.length === 1 ? 'test' : 'tests'} found
                  </p>
                  <button 
                    onClick={fetchTests}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                  >
                    Refresh
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {tests.map((test) => (
                    <TestCard 
                      key={test._id} 
                      test={test} 
                      onDelete={handleDeleteTest}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};