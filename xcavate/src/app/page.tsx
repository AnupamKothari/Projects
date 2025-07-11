'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/auth/LoginPage';
import ProjectManagerDashboard from '@/components/dashboard/ProjectManagerDashboard';
import OEMDashboard from '@/components/dashboard/OEMDashboard';
import OperatorDashboard from '@/components/dashboard/OperatorDashboard';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function Home() {
  const { user, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Route to appropriate dashboard based on user role
  switch (user.role) {
    case 'project_manager':
      return <ProjectManagerDashboard />;
    case 'oem':
      return <OEMDashboard />;
    case 'operator':
      return <OperatorDashboard />;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
            <p className="text-gray-600">Invalid user role. Please contact support.</p>
          </div>
        </div>
      );
  }
}
