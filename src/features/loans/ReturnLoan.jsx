import React, { useState, useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { SearchBar } from '../../components';
import {
  isLoanOverdue,
  getDaysOverdue,
  formatDateDisplay,
} from '../../utils/libraryUtils';

export default function ReturnLoan() {
  const { loans, books, members, returnLoan, setError } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeLoans = useMemo(() => {
    return loans
      .filter((l) => !l.returnDate)
      .filter((loan) => {
        const book = books.find((b) => b.id === loan.bookId);
        const member = members.find((m) => m.id === loan.memberId);

        return (
          (book && book.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (member && member.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          loan.id.includes(searchTerm)
        );
      })
      .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
  }, [loans, books, members, searchTerm]);

  const handleReturn = async () => {
    if (!selectedLoan) {
      setError('Please select a loan');
      return;
    }

    setIsProcessing(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      const book = books.find((b) => b.id === selectedLoan.bookId);
      const member = members.find((m) => m.id === selectedLoan.memberId);

      returnLoan(selectedLoan.id, today);
      setError(null);
      setSelectedLoan(null);

      alert(
        `Book returned successfully!\n\nMember: ${member?.name}\nBook: ${book?.title}\nReturned: ${formatDateDisplay(today)}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Find Loan to Return</h3>
        <SearchBar
          placeholder="Search by member name, book title, or loan ID..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loans List */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            Active Loans ({activeLoans.length})
          </h3>

          {activeLoans.length > 0 ? (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {activeLoans.map((loan) => {
                const book = books.find((b) => b.id === loan.bookId);
                const member = members.find((m) => m.id === loan.memberId);
                const isOverdue = isLoanOverdue(loan);
                const daysOverdue = getDaysOverdue(loan);

                return (
                  <button
                    key={loan.id}
                    onClick={() => setSelectedLoan(loan)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                      selectedLoan?.id === loan.id
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{book?.title}</p>
                        <p className="text-sm text-gray-600">{member?.name}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {loan.id}
                        </p>
                      </div>
                      {isOverdue && (
                        <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                          {daysOverdue}d Overdue
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No active loans found</p>
          )}
        </div>

        {/* Return Details */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Return Details</h3>

          {selectedLoan ? (
            <div className="space-y-4">
              {(() => {
                const book = books.find((b) => b.id === selectedLoan.bookId);
                const member = members.find((m) => m.id === selectedLoan.memberId);
                const isOverdue = isLoanOverdue(selectedLoan);
                const daysOverdue = getDaysOverdue(selectedLoan);

                return (
                  <>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Book & Member</h4>
                      <div className="space-y-2 text-sm">
                        <p>
                          <span className="text-gray-600">Book:</span>{' '}
                          <span className="font-medium text-gray-900">{book?.title}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">Member:</span>{' '}
                          <span className="font-medium text-gray-900">{member?.name}</span>
                        </p>
                        <p>
                          <span className="text-gray-600">Member ID:</span>{' '}
                          <span className="font-mono text-gray-900">{member?.id}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Issue Date:</span>{' '}
                        <span className="font-medium text-gray-900">
                          {formatDateDisplay(selectedLoan.issueDate)}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-600">Due Date:</span>{' '}
                        <span className="font-medium text-gray-900">
                          {formatDateDisplay(selectedLoan.dueDate)}
                        </span>
                      </p>
                      <p>
                        <span className="text-gray-600">Return Date:</span>{' '}
                        <span className="font-medium text-gray-900">
                          {formatDateDisplay(new Date().toISOString().split('T')[0])}
                        </span>
                      </p>
                    </div>

                    {isOverdue && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-800 font-medium">
                          ⚠️ This loan is {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                        </p>
                      </div>
                    )}

                    <button
                      onClick={handleReturn}
                      disabled={isProcessing}
                      className="btn-primary w-full mt-4"
                    >
                      {isProcessing ? 'Processing...' : 'Confirm Return'}
                    </button>
                  </>
                );
              })()}
            </div>
          ) : (
            <p className="text-gray-500">Select a loan to view return details</p>
          )}
        </div>
      </div>
    </div>
  );
}
