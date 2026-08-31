import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Users,
  BarChart3,
  Repeat2,
  LayoutDashboard,
  X,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/books', label: 'Books', icon: BookOpen },
    { path: '/members', label: 'Members', icon: Users },
    { path: '/borrow-return', label: 'Borrow & Return', icon: Repeat2 },
    { path: '/reports', label: 'Reports', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed lg:static w-64 h-screen bg-slate-800 text-white transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-slate-700 flex items-center justify-between bg-slate-900">
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">BookNest</h1>
              <p className="text-xs text-slate-300">Library Management</p>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1 hover:bg-white/20 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-white transition-all duration-200 ${
                    active
                      ? 'bg-indigo-600 shadow-lg scale-105'
                      : 'hover:bg-slate-700 hover:shadow-md'
                  }`}
                >
                  <Icon size={20} className={active ? 'text-yellow-300' : 'text-slate-300'} />
                  <span className="flex-1 text-left font-medium">{item.label}</span>
                  {active && <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-700 text-xs text-slate-400 bg-slate-900">
            <p className="font-semibold">BookNest v1.0</p>
            <p className="text-slate-500">Library Management System</p>
          </div>
        </div>
      </aside>
    </>
  );
}
