// src/components/Home/Home.jsx
// src/components/Home.jsx
import React, { useState } from 'react';
import { Calendar, Clock, Users, BookOpen, Star, ArrowRight, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../Auth/Auth';

const Homepage = ({ navigate }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <Calendar className="h-8 w-8 text-indigo-600" />,
      title: "Smart Scheduling",
      description: "AI-powered schedule optimization that considers teacher preferences, room availability, and student needs."
    },
    {
      icon: <Clock className="h-8 w-8 text-indigo-600" />,
      title: "Time Management",
      description: "Effortlessly manage class timings, break schedules, and substitute arrangements with our intuitive interface."
    },
    {
      icon: <Users className="h-8 w-8 text-indigo-600" />,
      title: "Team Collaboration",
      description: "Enable seamless communication between teachers, administrators, and staff for better coordination."
    },
    {
      icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
      title: "Resource Planning",
      description: "Optimize classroom and resource allocation to ensure maximum utilization and minimal conflicts."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "High School Principal",
      content: "EduSchedule transformed how we manage our school timetables. What used to take weeks now takes hours!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Math Teacher",
      content: "Finally, a scheduling system that actually understands the complexity of modern education.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="flex-shrink-0">
            <img
              src="./logo.svg"
              alt="Planora Logo"
              className="h-[70px] w-auto object-contain"
            />
          </div>
              </div>
            </div>

            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-700 hover:text-indigo-600 font-medium">Features</a>
              <a href="#about" className="text-gray-700 hover:text-indigo-600 font-medium">About</a>
              <a href="#testimonials" className="text-gray-700 hover:text-indigo-600 font-medium">Testimonials</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">Welcome, {user.name}</span>
                  <button
                    onClick={() => navigate('dashboard')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={logout}
                    className="text-gray-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate('login')}
                    className="text-gray-700 hover:text-indigo-600 font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('signup')}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>

            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Features</a>
              <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">About</a>
              <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-indigo-600">Testimonials</a>
              {user ? (
                <>
                  <button
                    onClick={() => navigate('dashboard')}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-3 py-2 text-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('login')}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:text-indigo-600"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => navigate('signup')}
                    className="block w-full text-left px-3 py-2 bg-indigo-600 text-white rounded-lg mt-2"
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Revolutionize Your 
                <span className="text-indigo-600"> School Scheduling</span>
              </h1>
              <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                Streamline teacher schedules, optimize resources, and enhance educational efficiency with our intelligent scheduling platform.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate(user ? 'dashboard' : 'signup')}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <span>{user ? 'Go to Dashboard' : 'Start Free Trial'}</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-indigo-600 hover:text-indigo-600 transition-colors">
                  Watch Demo
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 transform rotate-3">
                <div className="bg-indigo-600 rounded-lg p-4 mb-4">
                  <Calendar className="h-8 w-8 text-white mx-auto" />
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-green-500 rounded-full w-3 h-3"></div>
                      <span className="text-sm font-medium">Math - Room 204</span>
                    </div>
                    <span className="text-xs text-gray-500">9:00 AM - 10:30 AM</span>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-500 rounded-full w-3 h-3"></div>
                      <span className="text-sm font-medium">Science - Lab 1</span>
                    </div>
                    <span className="text-xs text-gray-500">11:00 AM - 12:30 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Education
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage teacher schedules efficiently and effectively
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow">
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Educators Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of schools already using Planora
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="bg-indigo-100 rounded-full p-2 mr-3">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-indigo-600 rounded-lg p-2">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold">Planora</span>
              </div>
              <p className="text-gray-400">
                Empowering educational institutions with intelligent scheduling solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 EduSchedule. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;