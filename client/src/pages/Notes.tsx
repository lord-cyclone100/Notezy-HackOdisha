import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config/config"
import { useAuth } from '../context/AuthContext';
import { NoteCard } from '../components/elements/NoteCard';

// Define interfaces
interface Note {
  _id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
  // Add other properties as needed
}

export const Notes = () => {
  const { user, isAuthenticated } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set());
  const [isTestGenerating, setIsTestGenerating] = useState(false);
  const [showTestMode, setShowTestMode] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated]);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${BACKEND_URL}notes`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotes(response.data.notes || []);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to load notes. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${BACKEND_URL}notes/${noteId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Remove the deleted note from the state
      setNotes(notes.filter(note => note._id !== noteId));
      // Remove from selection if it was selected
      setSelectedNotes(prev => {
        const newSet = new Set(prev);
        newSet.delete(noteId);
        return newSet;
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note. Please try again.');
    }
  };

  const handleNoteSelection = (noteId: string, isSelected: boolean) => {
    setSelectedNotes(prev => {
      const newSet = new Set(prev);
      if (isSelected) {
        newSet.add(noteId);
      } else {
        newSet.delete(noteId);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedNotes.size === notes.length) {
      setSelectedNotes(new Set());
    } else {
      setSelectedNotes(new Set(notes.map(note => note._id)));
    }
  };

  const handleGenerateTest = async () => {
    if (selectedNotes.size === 0) {
      alert('Please select at least one note to generate a test.');
      return;
    }

    try {
      setIsTestGenerating(true);
      const token = localStorage.getItem('token');
      await axios.post(`${BACKEND_URL}tests`, {
        note_ids: Array.from(selectedNotes)
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Clear selection and exit test mode
      setSelectedNotes(new Set());
      setShowTestMode(false);
      
      alert('Test generated successfully! Check your My Tests page to view it.');
    } catch (error) {
      console.error('Error generating test:', error);
      alert('Failed to generate test. Please try again.');
    } finally {
      setIsTestGenerating(false);
    }
  };

  const toggleTestMode = () => {
    setShowTestMode(!showTestMode);
    if (showTestMode) {
      setSelectedNotes(new Set());
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">Access Denied</h2>
          <p className="text-slate-600 dark:text-slate-400">Please log in to view your notes.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200 mb-2">My Notes</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Welcome back, {user?.name}! Here are your saved notes.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            <span className="ml-4 text-slate-600 dark:text-slate-400">Loading your notes...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={fetchNotes}
              className="mt-2 text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-medium"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Notes Grid */}
        {!isLoading && !error && (
          <>
            {notes.length === 0 ? (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <svg className="w-16 h-16 text-slate-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">No Notes Yet</h3>
                  <p className="text-slate-500 dark:text-slate-500 mb-4">
                    You haven't saved any notes yet. Start by generating some notes from a YouTube video and clicking the save button.
                  </p>
                  <a 
                    href="/learn" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Create Your First Note
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <p className="text-slate-600 dark:text-slate-400">
                    {notes.length} {notes.length === 1 ? 'note' : 'notes'} found
                  </p>
                  <div className="flex gap-3">
                    {showTestMode ? (
                      <>
                        <button 
                          onClick={handleSelectAll}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium px-3 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                        >
                          {selectedNotes.size === notes.length ? 'Deselect All' : 'Select All'}
                        </button>
                        <button 
                          onClick={handleGenerateTest}
                          disabled={selectedNotes.size === 0 || isTestGenerating}
                          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {isTestGenerating ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Generate Test ({selectedNotes.size})
                            </>
                          )}
                        </button>
                        <button 
                          onClick={toggleTestMode}
                          className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300 font-medium px-3 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={toggleTestMode}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Generate Test
                        </button>
                        <button 
                          onClick={fetchNotes}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                        >
                          Refresh
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {showTestMode && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="font-semibold text-blue-800 dark:text-blue-300">Test Generation Mode</h3>
                    </div>
                    <p className="text-blue-700 dark:text-blue-300 text-sm">
                      Select the notes you want to include in your test. The AI will generate 15-20 multiple choice questions based on the content from your selected notes.
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notes.map((note) => (
                    <NoteCard 
                      key={note._id} 
                      note={note} 
                      onDelete={showTestMode ? undefined : handleDeleteNote}
                      showCheckbox={showTestMode}
                      isSelected={selectedNotes.has(note._id)}
                      onSelectionChange={handleNoteSelection}
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