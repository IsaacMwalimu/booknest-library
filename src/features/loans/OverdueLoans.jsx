import React, { useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import {
  isLoanOverdue,
  getDaysOverdue,
  formatDateDisplay,
} from '../../utils/libraryUtils';

export default function OverdueLoans() {
  const { loans, books, members } = useLibrary();

  const overdueLoans = useMemo(() => {
    return loans
      .filter((l) => !l.returnDate && isLoanOverdue(l))
      .sort((a, b) => getDaysOverdue(b) - getDaysOverdue(a));
  }, [loans]);

  return (
    <div className="card overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Overdue Loans ({overdueLoans.length})</h3>

      {overdueLoans.length > 0 ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Member</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Book</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">Due Date</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">Days Overdue</th>
            </tr>
          </thead>
          <tbody>
            {overdueLoans.map((loan) => {
              const book = books.find((b) => b.id === loan.bookId);
              const member = members.find((m) => m.id === loan.memberId);
              const daysOverdue = getDaysOverdue(loan);

              return (
                <tr key={loan.id} className="border-b border-gray-200 hover:bg-red-50">
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
                  <td className="px-4 py-3 text-center font-medium">
                    {formatDateDisplay(loan.dueDate)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="bg-red-100 text-red-800 font-semibold px-2 py-1 rounded">
                      {daysOverdue} day{daysOverdue !== 1 ? 's' : ''}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-center py-8 text-gray-500">No overdue loans</p>
      )}
    </div>
  );
}
