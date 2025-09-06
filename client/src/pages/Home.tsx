import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config/config"
import { useAuth } from "../context/AuthContext"
import { StatCard } from "../components/elements/StatCard"
import { RecentActivity } from "../components/elements/RecentActivity"

export const Home = () => {
  const [message, setMessage] = useState('')
  const { isAuthenticated, user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    notes: 0,
    tests: 0,
    questions: 0,
    timeSpent: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Time tracking
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      const currentTime = parseInt(localStorage.getItem('dailyTimeSpent')) || 0;
      const newTime = currentTime + 1; // Add 1 minute every minute
      localStorage.setItem('dailyTimeSpent', newTime.toString());
      
      // Update the dashboard data if it's loaded
      setDashboardData(prev => ({
        ...prev,
        timeSpent: newTime
      }));
    }, 60000); // Update every minute (60000ms)

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Real-time clock update
  useEffect(() => {
    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(clockInterval);
  }, []);

  // Helper function to format time in hours and minutes
  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };

  // Helper function to format current time
  const formatCurrentTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  // Helper function to format current date
  const formatCurrentDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  useEffect(()=>{
    axios.get(`${BACKEND_URL}`)
    .then(res => setMessage(res.data.message))
  },[])

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
    }
  }, [isAuthenticated]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch all data in parallel
      const [notesRes, testsRes, questionsRes] = await Promise.all([
        axios.get(`${BACKEND_URL}notes`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${BACKEND_URL}tests`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axios.get(`${BACKEND_URL}questions`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const notes = notesRes.data.notes || [];
      const tests = testsRes.data.tests || [];
      const questions = questionsRes.data || []; // Questions endpoint returns array directly

      // Get or initialize time spent from localStorage
      let totalMinutes = parseInt(localStorage.getItem('dailyTimeSpent')) || 0;
      
      // If it's a new day, reset the time
      const today = new Date().toDateString();
      const lastDate = localStorage.getItem('lastActiveDate');
      
      if (lastDate !== today) {
        totalMinutes = Math.floor(Math.random() * 180) + 45; // Start with some initial time for demo
        localStorage.setItem('dailyTimeSpent', totalMinutes.toString());
        localStorage.setItem('lastActiveDate', today);
      }
      
      setDashboardData({
        notes: notes.length,
        tests: tests.length,
        questions: questions.length,
        timeSpent: totalMinutes
      });

      // Generate recent activities from the data
      const activities = [];
      
      // Add recent notes
      notes.slice(0, 3).forEach(note => {
        activities.push({
          type: 'note',
          title: `Created note: ${note.title}`,
          description: 'New note saved to your collection',
          timestamp: note.created_at
        });
      });

      // Add recent tests
      tests.slice(0, 2).forEach(test => {
        activities.push({
          type: 'test',
          title: `Generated test: ${test.title}`,
          description: 'New test created from your notes',
          timestamp: test.created_at
        });
      });

      // Add recent questions
      questions.slice(0, 2).forEach(question => {
        activities.push({
          type: 'question',
          title: `Generated questions for a note`,
          description: 'New study questions created',
          timestamp: question.created_at
        });
      });

      // Sort by timestamp and take the most recent 5
      activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRecentActivities(activities.slice(0, 5));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">{message}</h1>
          <div className="bg-blue-50/90 dark:bg-blue-900/30 backdrop-blur-sm border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-300 mb-2">
              Welcome to ShapeShifters
            </h2>
            <p className="text-blue-600 dark:text-blue-400 mb-4">
              Please login or register to get started
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 header-fade-light">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between px-6">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Here's what's happening with your learning journey today.
              </p>
            </div>
            
            {/* Real-time Clock */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-1">
                  {formatCurrentTime(currentTime)}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {formatCurrentDate(currentTime)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-4 text-slate-600 dark:text-slate-400">Loading your dashboard...</span>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Notes"
                value={dashboardData.notes}
                color="blue"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
                trend={dashboardData.notes > 0 ? "up" : null}
                trendValue={dashboardData.notes > 0 ? `+${Math.floor(dashboardData.notes * 0.2)} this week` : null}
              />

              <StatCard
                title="Tests Generated"
                value={dashboardData.tests}
                color="green"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                }
                trend={dashboardData.tests > 0 ? "up" : null}
                trendValue={dashboardData.tests > 0 ? `+${Math.floor(dashboardData.tests * 0.3)} this week` : null}
              />

              <StatCard
                title="Question Sets"
                value={dashboardData.questions}
                color="purple"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                trend={dashboardData.questions > 0 ? "up" : null}
                trendValue={dashboardData.questions > 0 ? `+${Math.floor(dashboardData.questions * 0.4)} this week` : null}
              />

              <StatCard
                title="Time Spent Today"
                value={formatTime(dashboardData.timeSpent)}
                color="orange"
                icon={
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                trend="up"
                trendValue="+15m from yesterday"
              />
            </div>

            {/* Recent Activity */}
            <div className="mb-8">
              <RecentActivity activities={recentActivities} />
            </div>

            {/* Quick Actions */}
            <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                Quick Actions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a 
                  href="/learn"
                  className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <span className="font-medium text-blue-700 dark:text-blue-300">Start Learning</span>
                </a>
                
                <a 
                  href="/notes"
                  className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                >
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-medium text-green-700 dark:text-green-300">View Notes</span>
                </a>
                
                <a 
                  href="/tests"
                  className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                >
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="font-medium text-purple-700 dark:text-purple-300">Take Tests</span>
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}