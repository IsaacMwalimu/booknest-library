import React from 'react';
import { Menu, AlertCircle } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';

export default function Header({ onMenuClick, currentPage }) {
  const { error, clearError } = useLibrary();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 md:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">{currentPage}</h2>
        </div>

        {/* User indicator */}
        <div className="text-sm text-gray-600">
          📚 Librarian Demo Mode
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="px-4 md:px-6 py-3 bg-red-50 border-b border-red-200 flex items-center gap-3">
          <AlertCircle size={20} className="text-red-600" />
          <p className="text-red-800 flex-1">{error}</p>
          <button
            onClick={clearError}
            className="text-red-600 hover:text-red-800 font-medium"
          >
            Dismiss
          </button>
        </div>
      )}
    </header>
  );
}
