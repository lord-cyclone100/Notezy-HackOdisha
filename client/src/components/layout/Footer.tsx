export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-black via-gray-900 to-black border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img 
                src="/images/notezy.svg" 
                alt="ShapeShifters Logo" 
                className="w-24"
              />
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Transform your learning experience with AI-powered note-taking, 
              question generation, and test creation. Shape your knowledge, shift your potential.
            </p>
            <div className="flex space-x-4">
              
              <a 
                href="#" 
                className="text-gray-400 hover:text-gray-200 transition-colors duration-300"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-200 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/learn" className="text-gray-400 hover:text-gray-200 transition-colors duration-300">
                  Learn
                </a>
              </li>
              <li>
                <a href="/notes" className="text-gray-400 hover:text-gray-200 transition-colors duration-300">
                  Notes
                </a>
              </li>
              <li>
                <a href="/questions" className="text-gray-400 hover:text-gray-200 transition-colors duration-300">
                  Questions
                </a>
              </li>
              <li>
                <a href="/tests" className="text-gray-400 hover:text-gray-200 transition-colors duration-300">
                  Tests
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-gray-200 font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-400 hover:text-gray-200 transition-colors duration-300">
                  About
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-gray-200 transition-colors duration-300">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors duration-300">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-gray-200 transition-colors duration-300">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {currentYear} ShapeShifters. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-gray-400 text-sm">Made with</span>
              <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
              </svg>
              <span className="text-gray-400 text-sm">by Team ShapeShifters</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};