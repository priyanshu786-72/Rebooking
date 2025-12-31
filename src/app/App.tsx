import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { Toaster } from './components/ui/sonner';
import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import BuyerDashboard from './components/BuyerDashboard';
import SellerDashboard from './components/SellerDashboard';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="size-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading TicketShare...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show landing page or auth page
  if (!user) {
    if (showAuth) {
      return <AuthPage onBack={() => setShowAuth(false)} />;
    }
    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // Route based on user role
  if (user.role === 'admin') {
    return <AdminDashboard />;
  } else if (user.role === 'seller') {
    return <SellerDashboard />;
  } else {
    return <BuyerDashboard />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <div className="size-full">
        <AppContent />
        <Toaster position="top-right" />
      </div>
    </AuthProvider>
  );
}
