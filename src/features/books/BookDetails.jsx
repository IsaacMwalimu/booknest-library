import React, { useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { getAvailableCopies, formatDateDisplay } from '../../utils/libraryUtils';
import { StatusBadge } from '../../components';

export default function BookDetails({ book, onClose }) {
  const { loans, members } = useLibrary();

  const stats = useMemo(() => {
    const activeLoans = loans.filter((l) => l.bookId === book.id && !l.returnDate);
    const returnedLoans = loans.filter((l) => l.bookId === book.id && l.returnDate);

    return {
      available: getAvailableCopies(book, loans),
      active: activeLoans,
      returned: returnedLoans,
    };
  }, [book, loans]);

  return (
    <div className="space-y-6 max-h-screen overflow-y-auto">
      {/* Book Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-gray-600 text-sm">ISBN</p>
            <p className="font-mono text-gray-900">{book.isbn}</p>
          </div>
          <StatusBadge status={stats.available > 0 ? 'available' : 'unavailable'} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Category</p>
            <p className="font-medium text-gray-900">{book.category}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Shelf Location</p>
            <p className="font-medium text-gray-900">{book.shelfLocation}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Copies</p>
            <p className="font-medium text-gray-900">{book.totalCopies}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Available</p>
            <p className="font-medium text-green-600">{stats.available}</p>
          </div>
        </div>

        {book.description && (
          <div>
            <p className="text-gray-600 text-sm">Description</p>
            <p className="text-gray-900">{book.description}</p>
          </div>
        )}
      </div>

      {/* Active Loans */}
      {stats.active.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Current Loans ({stats.active.length})
          </h4>
          <div className="space-y-2">
            {stats.active.map((loan) => {
              const member = members.find((m) => m.id === loan.memberId);
              return (
                <div
                  key={loan.id}
                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="font-medium text-gray-900">{member?.name}</p>
                  <p className="text-sm text-gray-600">
                    Issued: {formatDateDisplay(loan.issueDate)} • Due: {formatDateDisplay(loan.dueDate)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Borrowing History */}
      {stats.returned.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Borrowing History ({stats.returned.length})
          </h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {stats.returned.slice().reverse().map((loan) => {
              const member = members.find((m) => m.id === loan.memberId);
              return (
                <div
                  key={loan.id}
                  className="p-2 bg-gray-50 border border-gray-200 rounded text-sm"
                >
                  <p className="font-medium text-gray-900">{member?.name}</p>
                  <p className="text-xs text-gray-600">
                    {formatDateDisplay(loan.issueDate)} → {formatDateDisplay(loan.returnDate)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Close Button */}
      <button onClick={onClose} className="btn-secondary w-full">
        Close
      </button>
    </div>
  );
}
