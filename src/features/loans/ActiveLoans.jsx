import React, { useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { formatDateDisplay } from '../../utils/libraryUtils';
import { StatusBadge } from '../../components';

export default function ActiveLoans() {
  const { loans, books, members } = useLibrary();

  const activeLoans = useMemo(() => {
    return loans
      .filter((l) => !l.returnDate)
      .sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
  }, [loans]);

  return (
    <div className="card overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Active Loans ({activeLoans.length})</h3>

      {activeLoans.length > 0 ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Member</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Book</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">Issue Date</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">Due Date</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody>
            {activeLoans.map((loan) => {
              const book = books.find((b) => b.id === loan.bookId);
              const member = members.find((m) => m.id === loan.memberId);

              return (
                <tr key={loan.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{member?.name}</p>
                      <p className="text-xs text-gray-600">{member?.id}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{book?.title}</p>
                      <p className="text-xs text-gray-600">{book?.author}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">{formatDateDisplay(loan.issueDate)}</td>
                  <td className="px-4 py-3 text-center font-medium text-indigo-600">
                    {formatDateDisplay(loan.dueDate)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <StatusBadge status="active" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-center py-8 text-gray-500">No active loans</p>
      )}
    </div>
  );
}
