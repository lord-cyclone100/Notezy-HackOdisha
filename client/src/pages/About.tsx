import { useEffect, useState } from "react"
import axios from "axios"
import { BACKEND_URL } from "../config/config"

export const About = () => {
  const [message, setMessage] = useState('')
  
  useEffect(()=>{
    axios.get(`${BACKEND_URL}about`)
    .then(res => setMessage(res.data.message))
  },[])

  const features = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6V4h6v2H9zm0 4a1 1 0 112 0v8a1 1 0 11-2 0v-8zm4 0a1 1 0 112 0v8a1 1 0 11-2 0v-8z" />
        </svg>
      ),
      title: "Smart Note Generation",
      description: "Transform YouTube videos and PDF documents into comprehensive, well-structured study notes using advanced AI technology."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: "Interactive Question Bank",
      description: "Generate custom study questions from your notes to enhance understanding and prepare for exams effectively."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      title: "Comprehensive Testing",
      description: "Create and take tests based on your study materials with multiple choice questions and instant feedback."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: "Educational Focus",
      description: "AI-powered content validation ensures only study-related materials are processed, maintaining academic integrity."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      title: "Multi-Format Support",
      description: "Process content from various sources including YouTube educational videos and PDF documents seamlessly."
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Instant Processing",
      description: "Get your study materials processed and organized in seconds with our high-performance AI infrastructure."
    }
  ];

  const teamMembers = [
    {
      name: "Development Team",
      role: "Full Stack Developers",
      description: "Passionate developers creating innovative educational solutions.",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      )
    },
    {
      name: "AI Research Team",
      role: "Machine Learning Engineers",
      description: "Experts in natural language processing and educational AI.",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      name: "UX Design Team",
      role: "User Experience Designers",
      description: "Creating intuitive and accessible learning experiences.",
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
      )
    }
  ];

  const stats = [
    { number: "10K+", label: "Notes Generated" },
    { number: "5K+", label: "Active Users" },
    { number: "50K+", label: "Questions Created" },
    { number: "99.9%", label: "Uptime" }
  ];

  return(
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-400/5 dark:to-indigo-400/5"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-full">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent mb-6">
              Notezy
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              {message || "Transform Your Learning Experience with AI-Powered Study Tools"}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium">
                🤖 AI-Powered
              </div>
              <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium">
                📚 Educational Focus
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium">
                ⚡ Instant Results
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8 md:p-12 shadow-xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              At Notezy, we believe that learning should be accessible, efficient, and engaging. Our AI-powered platform transforms educational content into structured study materials, helping students and professionals achieve their learning goals faster and more effectively.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Efficiency</h3>
              <p className="text-slate-600 dark:text-slate-400">Transform hours of content into digestible study materials in seconds.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 dark:bg-green-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Quality</h3>
              <p className="text-slate-600 dark:text-slate-400">AI-curated content ensures only educational materials are processed.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Accessibility</h3>
              <p className="text-slate-600 dark:text-slate-400">Making quality education tools available to learners everywhere.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-6">
            Powerful Features
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Discover the tools that make Notezy the ultimate study companion for modern learners.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-blue-100 text-lg">
              Join the growing community of learners who trust Notezy
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-6">
            Our Team
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Meet the passionate individuals behind Notezy, dedicated to revolutionizing education through technology.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-blue-600 dark:text-blue-400 mb-6 flex justify-center">
                {member.icon}
              </div>
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                {member.name}
              </h3>
              <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                {member.role}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {member.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-slate-700 p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-6">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
            Join thousands of students and professionals who are already using Notezy to accelerate their learning journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/learn"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Start Learning Now
            </a>
            <a
              href="/contact"
              className="border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-600 hover:text-white font-semibold px-8 py-3 rounded-lg transition-all duration-200"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}