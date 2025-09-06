import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config/config"
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown'
import { PdfUploadModal } from '../components/elements/PdfUploadModal';

export const Learn = () => {
  const { user, isAuthenticated } = useAuth();
  // const [message, setMessage] = useState('')
  const [displayMessage, setDisplayMessage] = useState('Notes appear here')
  const [displayTitle, setDisplayTitle] = useState('')
  const [youtubeData, setYoutubeData] = useState({yturl:''})
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState('')
  const [originalContent, setOriginalContent] = useState('')
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [showPdfModal, setShowPdfModal] = useState(false)
  const [uploadedPdf, setUploadedPdf] = useState(null)
  // useEffect(()=>{
  //   axios.get(`${BACKEND_URL}about`)
  //   .then(res => setMessage(res.data.message))
  // },[])

  const handleChange = (e) => {
    setYoutubeData({ ...youtubeData, [e.target.name]: e.target.value });
    // console.log(youtubeData);
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsLoading(true);
    setSaveSuccess(false); // Reset save success state
    setIsSaved(false); // Reset saved state when generating new content
    setIsEditing(false); // Exit edit mode if active
    setHasUnsavedChanges(false); // Reset unsaved changes
    setDisplayTitle(''); // Reset title
    setUploadedPdf(null); // Clear any uploaded PDF when processing YouTube
    try {
      const response = await axios.post(`${BACKEND_URL}transcribe`,youtubeData,{
        headers:{
          'Content-Type':'application/json'
        }
      })
      setDisplayMessage(response.data.message)
      setDisplayTitle(response.data.title)
      setOriginalContent(response.data.message) // Store original content
    } catch (error) {
      console.log(error);
      // Check if it's a non-educational content error
      if (error.response && error.response.status === 400 && error.response.data.is_educational === false) {
        setDisplayMessage(error.response.data.message);
        setDisplayTitle(error.response.data.title);
        setOriginalContent(error.response.data.message);
      } else {
        setDisplayMessage('Error occurred while processing the video. Please try again.');
        setDisplayTitle(''); // Clear title on error
      }
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(displayMessage);
  };

  const handleEditChange = (e) => {
    const newContent = e.target.value;
    setEditedContent(newContent);
    setHasUnsavedChanges(newContent !== originalContent);
    setIsSaved(false); // Mark as not saved when content changes
  };

  const handleSaveEdit = () => {
    setDisplayMessage(editedContent);
    setIsEditing(false);
    setOriginalContent(editedContent); // Update original content
    setHasUnsavedChanges(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(displayMessage);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  const handleSave = async () => {
    if (!displayMessage || displayMessage === 'Notes appear here') {
      alert('No content to save!');
      return;
    }

    setIsSaving(true);
    try {
      // Use the generated title or create a fallback title
      const title = displayTitle || 
        (youtubeData.yturl 
          ? `Notes from: ${youtubeData.yturl.substring(0, 50)}...`
          : `Notes - ${new Date().toLocaleDateString()}`);

      const token = localStorage.getItem('token');
      const response = await axios.post(`${BACKEND_URL}notes`, {
        title: title,
        content: displayMessage
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        setSaveSuccess(true);
        setIsSaved(true); // Mark as saved
        setHasUnsavedChanges(false); // Reset unsaved changes
        setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3 seconds
      }
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePdfUpload = async (file) => {
    setUploadedPdf(file);
    setYoutubeData({yturl: ''}); // Clear any YouTube URL when processing PDF
    
    // Process the PDF file
    setIsLoading(true);
    setSaveSuccess(false); // Reset save success state
    setIsSaved(false); // Reset saved state when generating new content
    setIsEditing(false); // Exit edit mode if active
    setHasUnsavedChanges(false); // Reset unsaved changes
    setDisplayTitle(''); // Reset title
    
    try {
      const formData = new FormData();
      formData.append('pdf', file);
      
      const response = await axios.post(`${BACKEND_URL}process-pdf`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setDisplayMessage(response.data.message);
      setDisplayTitle(response.data.title);
      setOriginalContent(response.data.message); // Store original content
    } catch (error) {
      console.error('Error processing PDF:', error);
      // Check if it's a non-educational content error
      if (error.response && error.response.status === 400 && error.response.data.is_educational === false) {
        setDisplayMessage(error.response.data.message);
        setDisplayTitle(error.response.data.title);
        setOriginalContent(error.response.data.message);
      } else {
        setDisplayMessage('Error occurred while processing the PDF file. Please try again.');
        setDisplayTitle(''); // Clear title on error
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPdfModal = () => {
    setShowPdfModal(true);
  };

  const handleClosePdfModal = () => {
    setShowPdfModal(false);
  };

  const handleRegenerate = async () => {
    if (uploadedPdf) {
      // Regenerate PDF content
      await handlePdfUpload(uploadedPdf);
    } else if (youtubeData.yturl.trim()) {
      // Regenerate YouTube content
      setIsLoading(true);
      setSaveSuccess(false);
      setIsSaved(false);
      setIsEditing(false);
      setHasUnsavedChanges(false);
      setDisplayTitle('');
      
      try {
        const response = await axios.post(`${BACKEND_URL}transcribe`, youtubeData, {
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setDisplayMessage(response.data.message);
        setDisplayTitle(response.data.title);
        setOriginalContent(response.data.message);
      } catch (error) {
        console.log(error);
        // Check if it's a non-educational content error
        if (error.response && error.response.status === 400 && error.response.data.is_educational === false) {
          setDisplayMessage(error.response.data.message);
          setDisplayTitle(error.response.data.title);
          setOriginalContent(error.response.data.message);
        } else {
          setDisplayMessage('Error occurred while processing the video. Please try again.');
          setDisplayTitle('');
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      alert('No content to regenerate. Please upload a PDF or enter a YouTube URL first.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div>
        <p>Please log in to view your notes.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="p-6">
        <h1>Notes</h1>
        <p>Welcome, {user?.name}!</p>
      </div>
      
      {/* Enhanced Input Section */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6 text-center">
            Choose Your Input Method
          </h2>
          
          <div className="flex flex-col lg:flex-row items-stretch gap-6">
            {/* YouTube URL Input */}
            <div className="flex-[2] w-full">
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  YouTube URL
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      name="yturl" 
                      placeholder="Enter YouTube URL here..." 
                      value={youtubeData.yturl}
                      className="w-full px-4 py-3 pl-12 pr-12 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.455 12 20.455 12 20.455s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    {youtubeData.yturl && (
                      <button
                        type="button"
                        onClick={() => setYoutubeData({yturl: ''})}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                        disabled={isLoading}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading || !youtubeData.yturl.trim()}
                    className={`px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg whitespace-nowrap ${
                      isLoading || !youtubeData.yturl.trim()
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transform hover:scale-[1.02] active:scale-[0.98]'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        Generate Notes
                      </div>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* OR Divider */}
            <div className="flex items-center lg:flex-col lg:justify-center">
              <div className="hidden lg:block w-px h-24 bg-slate-300 dark:bg-slate-600 mx-4"></div>
              <div className="lg:hidden w-full h-px bg-slate-300 dark:bg-slate-600 my-4"></div>
              <div className="absolute bg-white dark:bg-slate-800 px-4 py-2 rounded-full border border-slate-300 dark:border-slate-600">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  OR
                </span>
              </div>
              <div className="hidden lg:block w-px h-24 bg-slate-300 dark:bg-slate-600 mx-4"></div>
              <div className="lg:hidden w-full h-px bg-slate-300 dark:bg-slate-600 my-4"></div>
            </div>

            {/* PDF Upload Section */}
            <div className="flex-1 w-full">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  PDF Document
                </label>
                <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
                  {uploadedPdf ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                          {uploadedPdf.name}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {(uploadedPdf.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        PDF Processed Successfully
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-center">
                        <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          No PDF selected
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Click below to upload
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <button 
                  onClick={handleOpenPdfModal}
                  className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {uploadedPdf ? 'Change PDF' : 'Upload PDF'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto mt-8 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-8 overflow-hidden">
        <div className="max-h-[70vh] overflow-y-auto scrollbar-thin scrollbar-thumb-blue-300 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent pr-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
              <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Processing your video...</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">This may take a few moments</p>
            </div>
          ) : isEditing ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Edit Your Notes</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={handleSaveEdit}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-md transition-colors"
                  >
                    Apply Changes
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white text-sm rounded-md transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <textarea
                value={editedContent}
                onChange={handleEditChange}
                className="w-full h-96 p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Edit your notes here..."
              />
              {hasUnsavedChanges && (
                <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  You have unsaved changes
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Title Display */}
              {displayTitle && (
                <div className="border-b border-slate-200 dark:border-slate-600 pb-4">
                  <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 leading-tight">
                    {displayTitle}
                  </h2>
                </div>
              )}
              
              {/* Content Display */}
              <div className="prose prose-lg prose-slate dark:prose-invert max-w-none prose-headings:text-blue-900 dark:prose-headings:text-blue-300 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/30">
                <ReactMarkdown>{displayMessage}</ReactMarkdown>
              </div>
              
            </div>
          )}
        </div>
        
        {/* Action Buttons */}
        {!isLoading && displayMessage !== 'Notes appear here' && !isEditing && (
          <div className="border-t border-slate-200 dark:border-slate-600 pt-6 mt-4">
            <div className="flex flex-wrap gap-3 justify-center sm:justify-end">
              <button 
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving || (isSaved && !hasUnsavedChanges)}
                className={`px-4 py-2 ${
                  isSaving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : (isSaved && !hasUnsavedChanges)
                      ? 'bg-gray-400 cursor-not-allowed'
                      : saveSuccess 
                        ? 'bg-green-600' 
                        : 'bg-green-500 hover:bg-green-600'
                } text-white font-medium rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2`}
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Saved!
                  </>
                ) : (isSaved && !hasUnsavedChanges) ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Already Saved
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save
                  </>
                )}
              </button>
              <button 
                onClick={handleRegenerate}
                disabled={isLoading}
                className={`px-4 py-2 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-500 hover:bg-purple-600'
                } text-white font-medium rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Regenerating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Regenerate
                  </>
                )}
              </button>
            </div>
            
            {/* Status Messages */}
            <div className="mt-3 text-center">
              {isSaved && !hasUnsavedChanges && (
                <p className="text-sm text-green-600 dark:text-green-400 flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  This note has been saved. Make edits to enable saving again.
                </p>
              )}
              {hasUnsavedChanges && (
                <p className="text-sm text-amber-600 dark:text-amber-400 flex items-center justify-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 15.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  You have unsaved changes
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* PDF Upload Modal */}
      <PdfUploadModal 
        isOpen={showPdfModal}
        onClose={handleClosePdfModal}
        onFileSelect={handlePdfUpload}
      />
    </div>
  );
};