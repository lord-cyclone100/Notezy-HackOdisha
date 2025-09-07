import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';

// Define interfaces
interface Question {
  id: number;
  question: string;
  options: {
    letter: string;
    text: string;
  }[];
}

interface Test {
  title: string;
  test_content: string;
  created_at: string;
  source_notes?: string[];
}

interface TestViewModalProps {
  test: Test;
  isOpen: boolean;
  onClose: () => void;
}

interface SelectedAnswers {
  [questionId: number]: string;
}

interface AnswerKey {
  [questionId: number]: string;
}

export const TestViewModal = ({ test, isOpen, onClose }: TestViewModalProps) => {
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [showResults, setShowResults] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answerKey, setAnswerKey] = useState<AnswerKey>({});
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (test?.test_content) {
      parseQuestions(test.test_content);
    }
  }, [test]);

  const parseQuestions = (content: string) => {
    // Parse the markdown content to extract questions, options, and answer key
    const lines = content.split('\n');
    const parsedQuestions: Question[] = [];
    const parsedAnswerKey: AnswerKey = {};
    let currentQuestion: Question | null = null;
    let questionNumber = 0;
    let inAnswerKeySection = false;

    // First pass: find answer key section and parse it
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Check if we're entering the answer key section
      if (line.toLowerCase().includes('answer key') || 
          line.toLowerCase().includes('answers:') || 
          line.toLowerCase().includes('correct answers') ||
          line.toLowerCase().includes('answer:')) {
        inAnswerKeySection = true;
        continue;
      }
      
      // Parse answer key if we're in that section
      if (inAnswerKeySection && line) {
        // Handle comma-separated format like "1. A, 2. B, 3. C, 4. D, 5. A"
        const answerMatches = line.matchAll(/(\d+)[\.\:\)]\s*([A-D])/g);
        for (const match of answerMatches) {
          const questionNum = parseInt(match[1]);
          const answer = match[2];
          parsedAnswerKey[questionNum] = answer;
        }
        
        // Also try to match individual answer patterns on separate lines
        const singleAnswerMatch = line.match(/^(\d+)[\.\:\)]\s*([A-D])\s*$/);
        if (singleAnswerMatch) {
          const questionNum = parseInt(singleAnswerMatch[1]);
          const answer = singleAnswerMatch[2];
          parsedAnswerKey[questionNum] = answer;
        }
      }
    }

    // If no answer key was found in a dedicated section, look for it anywhere
    if (Object.keys(parsedAnswerKey).length === 0) {
      // Strategy 1: Look for lines with multiple answer patterns
      for (const line of lines) {
        const answerMatches = Array.from(line.matchAll(/(\d+)[\.\:\)]\s*([A-D])/g));
        if (answerMatches.length >= 3) { // If we find 3+ answers in one line, it's likely the answer key
          for (const match of answerMatches) {
            const questionNum = parseInt(match[1]);
            const answer = match[2];
            parsedAnswerKey[questionNum] = answer;
          }
          break;
        }
      }
    }

    // Strategy 2: If still no answer key, look for any line that looks like "1. A" type pattern at the end
    if (Object.keys(parsedAnswerKey).length === 0) {
      // Look for answer patterns in the last 20% of the content
      const lastSection = lines.slice(-Math.ceil(lines.length * 0.2));
      for (const line of lastSection) {
        const singleAnswerMatch = line.match(/^(\d+)[\.\:\)]\s*([A-D])\s*$/);
        if (singleAnswerMatch) {
          const questionNum = parseInt(singleAnswerMatch[1]);
          const answer = singleAnswerMatch[2];
          parsedAnswerKey[questionNum] = answer;
        }
      }
    }

    // Strategy 3: Emergency fallback - look for any pattern anywhere in content
    if (Object.keys(parsedAnswerKey).length === 0) {
      for (const line of lines) {
        // Very loose pattern matching
        const emergencyMatches = Array.from(line.matchAll(/(?:^|\s)(\d+)[\.\:\)]\s*([A-D])(?:\s|,|$)/g));
        for (const match of emergencyMatches) {
          const questionNum = parseInt(match[1]);
          const answer = match[2];
          if (questionNum <= parsedQuestions.length) { // Only accept reasonable question numbers
            parsedAnswerKey[questionNum] = answer;
          }
        }
      }
    }

    // Second pass: parse questions and options
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip answer key section
      if (line.toLowerCase().includes('answer key') || 
          line.toLowerCase().includes('answers:') || 
          line.toLowerCase().includes('correct answers') ||
          line.toLowerCase().includes('answer:')) {
        break; // Stop parsing questions when we hit the answer key
      }
      
      // Check if it's a question (starts with number and period)
      if (/^\d+\./.test(line)) {
        if (currentQuestion) {
          parsedQuestions.push(currentQuestion);
        }
        questionNumber++;
        currentQuestion = {
          id: questionNumber,
          question: line.replace(/^\d+\.\s*/, ''),
          options: []
        };
      }
      // Check if it's an option (A, B, C, D)
      else if (/^[A-D][\.\)]/.test(line) && currentQuestion) {
        const optionLetter = line.charAt(0);
        const optionText = line.replace(/^[A-D][\.\)]\s*/, '');
        currentQuestion.options.push({
          letter: optionLetter,
          text: optionText
        });
      }
    }
    
    // Add the last question
    if (currentQuestion) {
      parsedQuestions.push(currentQuestion);
    }
    
    setQuestions(parsedQuestions);
    setAnswerKey(parsedAnswerKey);
  };

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleCheckAnswers = () => {
    // Calculate score
    let correctAnswers = 0;
    
    questions.forEach(question => {
      const userAnswer = selectedAnswers[question.id];
      const correctAnswer = answerKey[question.id];
      
      // Only count as correct if:
      // 1. User has actually selected an answer (userAnswer is not undefined)
      // 2. The answer matches the correct answer
      // 3. The correct answer exists in the answer key
      if (userAnswer && correctAnswer && userAnswer === correctAnswer) {
        correctAnswers++;
      }
    });
    
    setScore(correctAnswers);
    setShowResults(true);
  };

  const resetTest = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const getAnsweredCount = () => {
    return Object.keys(selectedAnswers).length;
  };

  const getScorePercentage = () => {
    return questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  };

  const getScoreColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const markdownComponents = {
    h1: ({ children, ...props }: any) => (
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: any) => (
      <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3 mt-6" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }: any) => (
      <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2 mt-4" {...props}>
        {children}
      </h3>
    ),
    p: ({ children, ...props }: any) => (
      <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed" {...props}>
        {children}
      </p>
    ),
    ul: ({ children, ...props }: any) => (
      <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-1 ml-4" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: any) => (
      <ol className="list-decimal list-inside text-slate-700 dark:text-slate-300 mb-4 space-y-2 ml-4" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }: any) => (
      <li className="mb-1" {...props}>
        {children}
      </li>
    ),
    strong: ({ children, ...props }: any) => (
      <strong className="font-semibold text-slate-800 dark:text-slate-200" {...props}>
        {children}
      </strong>
    ),
    code: ({ children, ...props }: any) => (
      <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-sm font-mono" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }: any) => (
      <pre className="bg-slate-100 dark:bg-slate-700 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
        {children}
      </pre>
    ),
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
              {test.title}
            </h2>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {new Date(test.created_at).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {test.source_notes?.length || 0} source notes
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Source Notes */}
        {test.source_notes && test.source_notes.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Test generated from:</h3>
            <div className="flex flex-wrap gap-2">
              {test.source_notes.map((noteTitle, index) => (
                <span 
                  key={index}
                  className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs px-2 py-1 rounded-full"
                >
                  {noteTitle}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 min-h-0">
          {questions.length > 0 ? (
            <div className="space-y-6">
              {/* Progress indicator */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-blue-800 dark:text-blue-300">
                    Progress: {getAnsweredCount()} / {questions.length} questions answered
                  </span>
                  {!showResults && (
                    <button
                      onClick={handleCheckAnswers}
                      disabled={getAnsweredCount() === 0}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                    >
                      Check Answers ({getAnsweredCount()}/{questions.length})
                    </button>
                  )}
                  {showResults && (
                    <button
                      onClick={resetTest}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Retake Test
                    </button>
                  )}
                </div>
                {showResults && (
                  <div className="space-y-2">
                    <div className={`text-2xl font-bold ${getScoreColor()}`}>
                      Score: {score}/{questions.length} ({getScorePercentage()}%)
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {getScorePercentage() >= 80 && "Excellent work! 🎉"}
                      {getScorePercentage() >= 60 && getScorePercentage() < 80 && "Good job! Keep studying! 📚"}
                      {getScorePercentage() < 60 && "Keep practicing! You'll get there! 💪"}
                    </div>
                  </div>
                )}
              </div>

              {/* Questions */}
              {questions.map((question) => (
                <div key={question.id} className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4">
                    {question.id}. {question.question}
                  </h3>
                  
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <label
                        key={option.letter}
                        className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                          selectedAnswers[question.id] === option.letter
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={option.letter}
                          checked={selectedAnswers[question.id] === option.letter}
                          onChange={() => handleAnswerSelect(question.id, option.letter)}
                          className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
                          disabled={showResults}
                        />
                        <div className="flex-1">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            {option.letter}.
                          </span>
                          <span className="ml-2 text-slate-700 dark:text-slate-300">
                            {option.text}
                          </span>
                        </div>
                      </label>
                    ))}
                  </div>
                  
                  {showResults && (
                    <div className={`mt-4 p-3 rounded-lg border ${
                      selectedAnswers[question.id] && selectedAnswers[question.id] === answerKey[question.id]
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-medium ${
                          selectedAnswers[question.id] && selectedAnswers[question.id] === answerKey[question.id]
                            ? 'text-green-800 dark:text-green-300'
                            : 'text-red-800 dark:text-red-300'
                        }`}>
                          {selectedAnswers[question.id] ? (
                            <>
                              Your answer: {selectedAnswers[question.id]}
                              {selectedAnswers[question.id] === answerKey[question.id] ? (
                                <span className="ml-2">✓ Correct</span>
                              ) : (
                                <span className="ml-2">✗ Incorrect</span>
                              )}
                            </>
                          ) : (
                            <span className="ml-2">✗ Not answered</span>
                          )}
                        </span>
                        {(!selectedAnswers[question.id] || selectedAnswers[question.id] !== answerKey[question.id]) && (
                          <span className="text-sm font-medium text-green-800 dark:text-green-300">
                            Correct: {answerKey[question.id]}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown components={markdownComponents}>
                {test.test_content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex-shrink-0">
          <div className="flex justify-between items-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Press <kbd className="px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded text-xs">ESC</kbd> to close
            </p>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
