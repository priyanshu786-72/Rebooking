// Dashboard Layout - Main layout with navigation

import React, { useState } from 'react';
import { Train, Upload, Search, History, Settings, LogOut, Menu, X, Wallet, ShieldCheck, Users } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'seller':
        return 'bg-blue-100 text-blue-800';
      case 'buyer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Navigation items based on role
  const getNavItems = () => {
    if (user.role === 'admin') {
      return [
        { id: 'verify-tickets', label: 'Verify Tickets', icon: ShieldCheck },
        { id: 'manage-users', label: 'Manage Users', icon: Users },
        { id: 'all-transactions', label: 'All Transactions', icon: History },
      ];
    } else if (user.role === 'seller') {
      return [
        { id: 'upload-ticket', label: 'Upload Ticket', icon: Upload },
        { id: 'my-tickets', label: 'My Tickets', icon: Train },
        { id: 'my-transactions', label: 'My Transactions', icon: History },
      ];
    } else {
      return [
        { id: 'browse-tickets', label: 'Browse Tickets', icon: Search },
        { id: 'my-bookings', label: 'My Bookings', icon: Train },
        { id: 'my-transactions', label: 'My Transactions', icon: History },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Train className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-blue-900">TicketShare</h1>
                <p className="text-xs text-gray-500">Ticket Resale Platform</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              {/* Wallet Balance */}
              {user.role !== 'admin' && (
                <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                  <Wallet className="size-4 text-green-600" />
                  <span className="text-green-900">₹{user.walletBalance.toFixed(2)}</span>
                </div>
              )}

              {/* User Avatar */}
              <div className="hidden md:flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm text-gray-900">{user.name}</p>
                  <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
                <Avatar>
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Logout Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="hidden md:flex items-center space-x-2"
              >
                <LogOut className="size-4" />
                <span>Logout</span>
              </Button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-4">
              {/* User Info */}
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200 mb-4">
                <Avatar>
                  <AvatarFallback className="bg-blue-600 text-white">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-gray-900">{user.name}</p>
                  <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </div>
              </div>

              {/* Wallet Balance */}
              {user.role !== 'admin' && (
                <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200 mb-4">
                  <Wallet className="size-4 text-green-600" />
                  <span className="text-green-900">Wallet Balance: ₹{user.walletBalance.toFixed(2)}</span>
                </div>
              )}

              {/* Mobile Navigation */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === item.id
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="size-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Logout */}
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-4 py-3 mt-4 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="size-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};
