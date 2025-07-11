'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Wrench, User, Building2 } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const demoUsers = [
    {
      role: 'Project Manager',
      email: 'pm@xcavate.com',
      icon: <User className="w-5 h-5" />,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      role: 'OEM',
      email: 'oem@xcavate.com',
      icon: <Building2 className="w-5 h-5" />,
      color: 'bg-green-100 text-green-600'
    },
    {
      role: 'Operator',
      email: 'operator@xcavate.com',
      icon: <Wrench className="w-5 h-5" />,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  const handleDemoLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="inline-block animate-excavator">
              <svg 
                className="w-16 h-16 mx-auto text-white"
                viewBox="0 0 100 100"
                fill="currentColor"
              >
                {/* Simplified excavator icon */}
                <rect x="20" y="60" width="40" height="8" rx="4" />
                <rect x="15" y="45" width="20" height="15" rx="2" />
                <rect x="40" y="35" width="25" height="25" rx="3" />
                <rect x="50" y="20" width="8" height="15" rx="1" />
                <circle cx="25" cy="75" r="6" />
                <circle cx="55" cy="75" r="6" />
                <path d="M65 40 L80 30 L85 35 L70 45 Z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Xcavate</h1>
          <p className="text-white/80 text-lg">Intelligent Fleet Management</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Welcome Back
          </h2>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <LoadingSpinner size="small" color="text-white" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Demo Users */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Try Demo Accounts</span>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {demoUsers.map((user, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(user.email)}
                  className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${user.color}`}>
                      {user.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{user.role}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 font-mono">
                    password123
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Powered by IoT sensors and cloud analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;