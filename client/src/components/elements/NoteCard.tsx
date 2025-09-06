import { useState } from 'react';
import { NoteViewModal } from './NoteViewModal';

type Note = {
  _id: string;
  title: string;
  content: string;
  created_at: string;
};

type NoteCardProps = {
  note: Note;
  onDelete?: (id: string) => void;
  showCheckbox?: boolean;
  isSelected?: boolean;
  onSelectionChange?: (id: string, checked: boolean) => void;
};

export const NoteCard = ({ note, onDelete, showCheckbox = false, isSelected = false, onSelectionChange }: NoteCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPreview = (content: string) => {
    // Remove markdown formatting and get first 150 characters
    const plainText = content.replace(/[#*`\[\]()]/g, '').trim();
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  const handleViewNote = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleCheckboxChange = (e: { stopPropagation: () => void; target: { checked: boolean; }; }) => {
    e.stopPropagation();
    if (onSelectionChange) {
      onSelectionChange(note._id, e.target.checked);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3 flex-1">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="mt-1 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
          )}
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 line-clamp-2">
            {note.title}
          </h3>
        </div>
        {onDelete && (
          <button 
            onClick={() => onDelete(note._id)}
            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            title="Delete note"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {/* Content Preview */}
      <div className="mb-4">
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          {getPreview(note.content)}
        </p>
      </div>

      {/* Date and Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-600">
        <div className="flex items-center text-xs text-slate-500 dark:text-slate-400">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(note.created_at)}
        </div>
        
        <button 
          onClick={handleViewNote}
          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium px-3 py-1 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          View Full Note
        </button>
      </div>

      {/* Note View Modal */}
      <NoteViewModal 
        note={note}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
