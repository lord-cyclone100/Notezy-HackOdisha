import { NavLink } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { useState } from "react"
import { UserMenu } from "../elements/UserMenu"

export const Header = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return(
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-blue-900/20 backdrop-blur-xl border-b border-blue-400/20 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400/10 via-blue-500/5 to-transparent"></div>
        <nav className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <NavLink to='/' className="flex items-center">
                <img src="/images/notezy.svg" className="h-16" alt="Logo" />
              </NavLink>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {isAuthenticated && (
                <>
                  <NavLink 
                    to='/learn' 
                    className={({isActive}) => 
                      `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? 'bg-blue-500/30 backdrop-blur-sm text-blue-100 border border-blue-400/40' 
                          : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30'
                      }`
                    }
                  >
                    Learn
                  </NavLink>
                  <NavLink 
                    to='/notes' 
                    className={({isActive}) => 
                      `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? 'bg-blue-500/30 backdrop-blur-sm text-blue-100 border border-blue-400/40' 
                          : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30'
                      }`
                    }
                  >
                    My Notes
                  </NavLink>
                  <NavLink 
                    to='/questions' 
                    className={({isActive}) => 
                      `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? 'bg-blue-500/30 backdrop-blur-sm text-blue-100 border border-blue-400/40' 
                          : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30'
                      }`
                    }
                  >
                    My Questions
                  </NavLink>
                  <NavLink 
                    to='/tests' 
                    className={({isActive}) => 
                      `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive 
                          ? 'bg-blue-500/30 backdrop-blur-sm text-blue-100 border border-blue-400/40' 
                          : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30'
                      }`
                    }
                  >
                    My Tests
                  </NavLink>
                </>
              )}
              <NavLink 
                to='/about' 
                className={({isActive}) => 
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-500/30 backdrop-blur-sm text-blue-100 border border-blue-400/40' 
                      : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30'
                  }`
                }
              >
                About
              </NavLink>
              <NavLink 
                to='/contact' 
                className={({isActive}) => 
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-500/30 backdrop-blur-sm text-blue-100 border border-blue-400/40' 
                      : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30'
                  }`
                }
              >
                Contact
              </NavLink>
            </div>

            {/* Auth Buttons Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <UserMenu />
              ) : (
                <div className="flex space-x-3">
                  <NavLink to='/login'>
                    <button className="px-4 py-2 text-blue-200 hover:text-blue-100 text-sm font-medium rounded-lg hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30 transition-all duration-300">
                      Login
                    </button>
                  </NavLink>
                  <NavLink to='/register'>
                    <button className="px-4 py-2 bg-blue-500/30 backdrop-blur-sm hover:bg-blue-500/40 text-blue-100 text-sm font-medium rounded-lg border border-blue-400/40 hover:border-blue-400/60 transition-all duration-300">
                      Register
                    </button>
                  </NavLink>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-lg text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30 transition-all duration-300"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-blue-900/30 backdrop-blur-xl border-t border-blue-400/20 shadow-2xl">
                {isAuthenticated && (
                  <>
                    <NavLink 
                      to='/learn' 
                      onClick={closeMobileMenu}
                      className={({isActive}) => 
                        `block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                          isActive 
                            ? 'bg-blue-500/30 backdrop-blur-sm text-blue-100 border border-blue-400/40' 
                            : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30'
                        }`
                      }
                    >
                      Learn
                    </NavLink>
                    <NavLink 
                      to='/notes' 
                      onClick={closeMobileMenu}
                      className={({isActive}) => 
                        `block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                          isActive 
                            ? 'bg-blue-500/30 backdrop-blur-sm text-blue-100 border border-blue-400/40' 
                            : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30'
                        }`
                      }
                    >
                      My Notes
                    </NavLink>
                    <NavLink 
                      to='/questions' 
                      onClick={closeMobileMenu}
                      className={({isActive}) => 
                        `block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                          isActive 
                            ? 'bg-blue-500/30 backdrop-blur-sm text-blue-100 border border-blue-400/40' 
                            : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30'
                        }`
                      }
                    >
                      My Questions
                    </NavLink>
                    <NavLink 
                      to='/tests' 
                      onClick={closeMobileMenu}
                      className={({isActive}) => 
                        `block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                          isActive 
                            ? 'bg-blue-500/30 backdrop-blur-sm text-blue-100 border border-blue-400/40' 
                            : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30'
                        }`
                      }
                    >
                      My Tests
                    </NavLink>
                  </>
                )}
                <NavLink 
                  to='/about' 
                  onClick={closeMobileMenu}
                  className={({isActive}) => 
                    `block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-500/30 backdrop-blur-sm text-blue-100 border border-blue-400/40' 
                        : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30'
                    }`
                  }
                >
                  About
                </NavLink>
                <NavLink 
                  to='/contact' 
                  onClick={closeMobileMenu}
                  className={({isActive}) => 
                    `block px-3 py-2 rounded-lg text-base font-medium transition-all duration-300 ${
                      isActive 
                        ? 'bg-blue-500/30 backdrop-blur-sm text-blue-100 border border-blue-400/40' 
                        : 'text-blue-200 hover:text-blue-100 hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30'
                    }`
                  }
                >
                  Contact
                </NavLink>
                
                {/* Mobile Auth */}
                <div className="pt-4 border-t border-blue-400/30">
                  {isAuthenticated ? (
                    <div className="space-y-3">
                      <div className="px-3 py-2 text-sm text-blue-200">
                        Welcome, {user?.name}
                      </div>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 bg-red-500/20 backdrop-blur-sm hover:bg-red-500/30 text-red-100 text-base font-medium rounded-lg border border-red-400/30 hover:border-red-400/50 transition-all duration-300"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <NavLink to='/login' onClick={closeMobileMenu}>
                        <button className="w-full text-left px-3 py-2 text-blue-200 hover:text-blue-100 text-base font-medium rounded-lg hover:bg-blue-500/20 hover:backdrop-blur-sm hover:border hover:border-blue-400/30 transition-all duration-300">
                          Login
                        </button>
                      </NavLink>
                      <NavLink to='/register' onClick={closeMobileMenu}>
                        <button className="w-full text-left px-3 py-2 bg-blue-500/30 backdrop-blur-sm hover:bg-blue-500/40 text-blue-100 text-base font-medium rounded-lg border border-blue-400/40 hover:border-blue-400/60 transition-all duration-300">
                          Register
                        </button>
                      </NavLink>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>
      
      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-20"></div>
    </>
  )
}








