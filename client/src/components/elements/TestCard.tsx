import ReactMarkdown from 'react-markdown';
import { useState } from 'react';
import { TestViewModal } from './TestViewModal';

type TestType = {
  _id: string;
  title: string;
  test_content: string;
  source_notes?: string[];
  created_at: string;
};

type TestCardProps = {
  test: TestType;
  onDelete?: (id: string) => void;
};

export const TestCard = ({ test, onDelete }: TestCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  interface FormatDateOptions {
    year: 'numeric';
    month: 'long';
    day: 'numeric';
    hour: '2-digit';
    minute: '2-digit';
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    } as FormatDateOptions);
  };

  interface GetQuestionCountProps {
    content: string;
  }

  const getQuestionCount = (content: GetQuestionCountProps['content']): number | string => {
    // Count the number of questions by looking for numbered questions
    const questionMatches: RegExpMatchArray | null = content.match(/^\d+\./gm);
    return questionMatches ? questionMatches.length : 'Multiple';
  };

  const handleViewTest = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
            {test.title}
          </h3>
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {getQuestionCount(test.test_content)} Questions
          </div>
        </div>
        {onDelete && (
          <button 
            onClick={() => onDelete(test._id)}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete test"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Source Notes */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Generated from:</h4>
        <div className="flex flex-wrap gap-1">
          {test.source_notes?.slice(0, 3).map((noteTitle, index) => (
            <span 
              key={index}
              className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full"
            >
              {noteTitle.length > 20 ? noteTitle.substring(0, 20) + '...' : noteTitle}
            </span>
          ))}
          {test.source_notes && test.source_notes.length > 3 && (
            <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-full">
              +{test.source_notes.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Date and Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-600">
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(test.created_at)}
        </div>
        
        <button 
          onClick={handleViewTest}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          Take Test
        </button>
      </div>

      {/* Test View Modal */}
      <TestViewModal 
        test={test}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
