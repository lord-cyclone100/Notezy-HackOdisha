import ReactMarkdown from 'react-markdown';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { BACKEND_URL } from '../../config/config';

type Note = {
  _id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at?: string;
};

type NoteViewModalProps = {
  note: Note;
  isOpen: boolean;
  onClose: () => void;
};

export const NoteViewModal = ({ note, isOpen, onClose }: NoteViewModalProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateSuccess, setGenerateSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = 'unset';
      setIsVisible(false);
    }

    // Cleanup function to restore scroll on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const handleBackdropClick = (e: { target: any; currentTarget: any; }) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(note.content);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy content:', err);
    }
  };

  const handleGenerateQuestions = async () => {
    setIsGenerating(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${BACKEND_URL}questions`, {
        note_id: note._id
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        setGenerateSuccess(true);
        setTimeout(() => setGenerateSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  if (!isOpen || !note) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleBackdropClick}
    >
      <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden transition-transform duration-300 flex flex-col ${
        isVisible ? 'transform scale-100' : 'transform scale-95'
      }`}>
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 flex-shrink-0">
          <div className="flex-1 mr-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 leading-tight">
              {note.title}
            </h2>
            <div className="flex items-center mt-2 text-sm text-slate-500 dark:text-slate-400">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Created: {formatDate(note.created_at)}
              {note.updated_at && note.updated_at !== note.created_at && (
                <>
                  <span className="mx-2">•</span>
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Updated: {formatDate(note.updated_at)}
                </>
              )}
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="flex-shrink-0 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            title="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:text-blue-900 dark:prose-headings:text-blue-300 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/30">
            <ReactMarkdown 
              components={{
                h1: ({children}) => <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-300 mb-4 mt-8 first:mt-0">{children}</h1>,
                h2: ({children}) => <h2 className="text-2xl font-semibold text-blue-800 dark:text-blue-400 mb-3 mt-6">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-medium text-blue-700 dark:text-blue-500 mb-2 mt-4">{children}</h3>,
                p: ({children}) => <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{children}</p>,
                ul: ({children}) => <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">{children}</ul>,
                ol: ({children}) => <ol className="list-decimal list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">{children}</ol>,
                li: ({children}) => <li className="ml-4">{children}</li>,
                blockquote: ({children}) => (
                  <blockquote className="border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/30 p-4 my-4 italic rounded-r-lg">
                    {children}
                  </blockquote>
                ),
                code: (props) => {
                  const {inline, className, children, ...rest} = props as any;
                  return inline
                    ? <code className={`bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1 py-0.5 rounded text-sm font-mono ${className ?? ''}`} {...rest}>{children}</code>
                    : <code className={`block bg-gray-900 dark:bg-black text-gray-100 p-4 rounded-lg text-sm font-mono overflow-x-auto ${className ?? ''}`} {...rest}>{children}</code>;
                },
                strong: ({children}) => <strong className="font-bold text-gray-900 dark:text-gray-100">{children}</strong>,
                em: ({children}) => <em className="italic text-gray-700 dark:text-gray-400">{children}</em>,
              }}
            >
              {note.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Press <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">ESC</kbd> to close
            </div>
            <button 
              onClick={handleCopyContent}
              className={`flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                copySuccess 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
              title="Copy note content"
            >
              {copySuccess ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy Content
                </>
              )}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleGenerateQuestions}
              disabled={isGenerating}
              className={`px-4 py-2 ${
                isGenerating 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : generateSuccess 
                    ? 'bg-green-700' 
                    : 'bg-green-600 hover:bg-green-700'
              } text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2`}
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Generating...
                </>
              ) : generateSuccess ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Generated!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Generate Questions
                </>
              )}
            </button>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
