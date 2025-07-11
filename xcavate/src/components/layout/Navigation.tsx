'use client';

import React from 'react';
import { User } from '@/types';
import { LogOut, Settings, Bell } from 'lucide-react';

interface NavigationProps {
  user: User | null;
  onLogout: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ user, onLogout }) => {
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'project_manager':
        return 'Project Manager';
      case 'oem':
        return 'OEM';
      case 'operator':
        return 'Operator';
      default:
        return role;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'project_manager':
        return 'bg-blue-100 text-blue-800';
      case 'oem':
        return 'bg-green-100 text-green-800';
      case 'operator':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="animate-excavator mr-3">
                  <svg 
                    className="w-8 h-8 text-orange-500"
                    viewBox="0 0 100 100"
                    fill="currentColor"
                  >
                    <rect x="20" y="60" width="40" height="8" rx="4" />
                    <rect x="15" y="45" width="20" height="15" rx="2" />
                    <rect x="40" y="35" width="25" height="25" rx="3" />
                    <rect x="50" y="20" width="8" height="15" rx="1" />
                    <circle cx="25" cy="75" r="6" />
                    <circle cx="55" cy="75" r="6" />
                    <path d="M65 40 L80 30 L85 35 L70 45 Z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Xcavate</h1>
                  <p className="text-xs text-gray-500">Fleet Management</p>
                </div>
              </div>
            </div>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Settings */}
            <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user?.role || '')}`}>
                    {getRoleDisplayName(user?.role || '')}
                  </span>
                </div>
              </div>
              
              <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;