import React, { useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { getMemberActiveLoans, formatDateDisplay } from '../../utils/libraryUtils';
import { StatusBadge } from '../../components';

export default function MemberDetails({ member, onClose }) {
  const { loans, books } = useLibrary();

  const stats = useMemo(() => {
    const activeLoans = getMemberActiveLoans(member.id, loans);
    const allMemberLoans = loans.filter((l) => l.memberId === member.id);
    const returnedLoans = allMemberLoans.filter((l) => l.returnDate);

    return {
      active: activeLoans,
      returned: returnedLoans,
      totalBorrowed: allMemberLoans.length,
    };
  }, [member, loans]);

  return (
    <div className="space-y-6 max-h-screen overflow-y-auto">
      {/* Member Info */}
      <div className="space-y-3">
        <div>
          <p className="text-gray-600 text-sm">Member ID</p>
          <p className="font-mono font-semibold text-gray-900">{member.id}</p>
        </div>

        <div>
          <p className="text-gray-600 text-sm">Email</p>
          <p className="text-gray-900">{member.email}</p>
        </div>

        <div>
          <p className="text-gray-600 text-sm">Phone</p>
          <p className="text-gray-900">{member.phone}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Membership Date</p>
            <p className="font-medium text-gray-900">{formatDateDisplay(member.membershipDate)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <div className="mt-1">
              <StatusBadge status={member.status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Active Loans</p>
            <p className="text-2xl font-bold text-blue-600">{stats.active.length}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-600">Total Borrowed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalBorrowed}</p>
          </div>
        </div>
      </div>

      {/* Active Loans */}
      {stats.active.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">Current Loans ({stats.active.length})</h4>
          <div className="space-y-2">
            {stats.active.map((loan) => {
              const book = books.find((b) => b.id === loan.bookId);
              return (
                <div
                  key={loan.id}
                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <p className="font-medium text-gray-900">{book?.title}</p>
                  <p className="text-xs text-gray-600">
                    Due: {formatDateDisplay(loan.dueDate)}
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
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {stats.returned.slice().reverse().map((loan) => {
              const book = books.find((b) => b.id === loan.bookId);
              return (
                <div
                  key={loan.id}
                  className="p-2 bg-gray-50 border border-gray-200 rounded text-sm"
                >
                  <p className="font-medium text-gray-900">{book?.title}</p>
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
