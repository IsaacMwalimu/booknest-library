import React, { useState, useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { SearchBar, StatusBadge } from '../../components';
import {
  getMemberActiveLoans,
  getAvailableCopies,
  hasMemberBorrowedBook,
  isBookAvailable,
  formatDateDisplay,
} from '../../utils/libraryUtils';

const LOAN_PERIOD_DAYS = 14;
const MAX_LOANS = 3;

export default function IssueLoan() {
  const { members, books, loans, addLoan, setError } = useLibrary();
  const [memberSearch, setMemberSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const filteredMembers = useMemo(() => {
    return members
      .filter(
        (m) =>
          m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
          m.id.includes(memberSearch) ||
          m.email.toLowerCase().includes(memberSearch.toLowerCase())
      )
      .slice(0, 5);
  }, [members, memberSearch]);

  const filteredBooks = useMemo(() => {
    return books
      .filter((b) => !b.archived)
      .filter(
        (b) =>
          b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
          b.author.toLowerCase().includes(bookSearch.toLowerCase()) ||
          b.isbn.includes(bookSearch)
      )
      .slice(0, 5);
  }, [books, bookSearch]);

  const memberActiveLoanCount = selectedMember
    ? getMemberActiveLoans(selectedMember.id, loans).length
    : 0;

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const dueDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + LOAN_PERIOD_DAYS);
    return d.toISOString().split('T')[0];
  }, []);

  const canIssue = () => {
    if (!selectedMember) {
      setError('Please select a member');
      return false;
    }

    if (selectedMember.status !== 'active') {
      setError('Cannot issue books to inactive members');
      return false;
    }

    if (memberActiveLoanCount >= MAX_LOANS) {
      setError(`Member has reached the maximum of ${MAX_LOANS} active loans`);
      return false;
    }

    if (!selectedBook) {
      setError('Please select a book');
      return false;
    }

    if (!isBookAvailable(selectedBook, loans)) {
      setError('This book is currently unavailable');
      return false;
    }

    if (hasMemberBorrowedBook(selectedMember.id, selectedBook.id, loans)) {
      setError('Member already has an active loan for this book');
      return false;
    }

    return true;
  };

  const handleIssue = async () => {
    if (!canIssue()) return;

    setIsProcessing(true);
    try {
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(dueDate.getDate() + LOAN_PERIOD_DAYS);

      const newLoan = {
        id: Math.random().toString(36).substr(2, 9),
        bookId: selectedBook.id,
        memberId: selectedMember.id,
        issueDate: today.toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        returnDate: null,
        createdAt: today.toISOString().split('T')[0],
      };

      addLoan(newLoan);
      setError(null);
      setSelectedMember(null);
      setSelectedBook(null);
      setMemberSearch('');
      setBookSearch('');
      alert(
        `Book issued successfully!\n\nMember: ${selectedMember.name}\nBook: ${selectedBook.title}\nDue: ${formatDateDisplay(dueDate.toISOString().split('T')[0])}`
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const getIssueWarnings = () => {
    const warnings = [];

    if (selectedMember && selectedMember.status !== 'active') {
      warnings.push('Member is inactive');
    }

    if (memberActiveLoanCount >= MAX_LOANS - 1 && memberActiveLoanCount < MAX_LOANS) {
      warnings.push(`Member has ${memberActiveLoanCount} active loans (limit: ${MAX_LOANS})`);
    }

    if (selectedBook && !isBookAvailable(selectedBook, loans)) {
      warnings.push('Book is unavailable (all copies checked out)');
    }

    if (selectedBook && hasMemberBorrowedBook(selectedMember?.id, selectedBook.id, loans)) {
      warnings.push('Member already has this book');
    }

    return warnings;
  };

  const warnings = getIssueWarnings();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Member Selection */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Step 1: Select Member</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Members
              </label>
              <SearchBar
                placeholder="Name, ID, or email..."
                value={memberSearch}
                onChange={setMemberSearch}
              />
            </div>

            {memberSearch && filteredMembers.length > 0 && (
              <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {filteredMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => {
                      setSelectedMember(member);
                      setMemberSearch('');
                    }}
                    className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                  >
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-600">{member.id} • {member.email}</p>
                  </button>
                ))}
              </div>
            )}

            {selectedMember && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-900">{selectedMember.name}</p>
                    <p className="text-sm text-gray-600">{selectedMember.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-600">Status:</span>{' '}
                    <StatusBadge status={selectedMember.status} />
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Active Loans:</span> {memberActiveLoanCount}/{MAX_LOANS}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Book Selection */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Step 2: Select Book</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Books
              </label>
              <SearchBar
                placeholder="Title, author, or ISBN..."
                value={bookSearch}
                onChange={setBookSearch}
              />
            </div>

            {bookSearch && filteredBooks.length > 0 && (
              <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {filteredBooks.map((book) => {
                  const available = getAvailableCopies(book, loans);
                  return (
                    <button
                      key={book.id}
                      onClick={() => {
                        setSelectedBook(book);
                        setBookSearch('');
                      }}
                      className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <p className="font-medium text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-600">{book.author}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Available: {available}/{book.totalCopies}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}

            {selectedBook && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-gray-900">{selectedBook.title}</p>
                    <p className="text-sm text-gray-600">{selectedBook.author}</p>
                  </div>
                  <button
                    onClick={() => setSelectedBook(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-1 text-sm">
                  <p>
                    <span className="text-gray-600">Available:</span>{' '}
                    <span className="font-medium">
                      {getAvailableCopies(selectedBook, loans)}/{selectedBook.totalCopies}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review and Confirm */}
      {selectedMember && selectedBook && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Step 3: Review & Confirm</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Issue Date</p>
              <p className="font-medium text-gray-900">{formatDateDisplay(today)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Due Date</p>
              <p className="font-medium text-gray-900">{formatDateDisplay(dueDate)}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Loan Period</p>
              <p className="font-medium text-gray-900">{LOAN_PERIOD_DAYS} days</p>
            </div>
          </div>

          {warnings.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
              <p className="text-sm font-medium text-amber-900 mb-2">⚠️ Warnings:</p>
              <ul className="text-sm text-amber-800 space-y-1">
                {warnings.map((w, i) => (
                  <li key={i}>• {w}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            onClick={handleIssue}
            disabled={isProcessing || !canIssue()}
            className="btn-primary w-full"
          >
            {isProcessing ? 'Processing...' : 'Confirm Issue'}
          </button>
        </div>
      )}
    </div>
  );
}
