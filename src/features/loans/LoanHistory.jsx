import React, { useMemo } from 'react';
import { useLibrary } from '../../context/LibraryContext';
import { formatDateDisplay } from '../../utils/libraryUtils';

export default function LoanHistory() {
  const { loans, books, members } = useLibrary();

  const history = useMemo(() => {
    return loans
      .filter((l) => l.returnDate)
      .sort((a, b) => new Date(b.returnDate) - new Date(a.returnDate));
  }, [loans]);

  return (
    <div className="card overflow-x-auto">
      <h3 className="text-lg font-semibold mb-4">Loan History ({history.length})</h3>

      {history.length > 0 ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Member</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Book</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">Issue Date</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">Return Date</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">Duration</th>
            </tr>
          </thead>
          <tbody>
            {history.map((loan) => {
              const book = books.find((b) => b.id === loan.bookId);
              const member = members.find((m) => m.id === loan.memberId);

              const days = Math.floor(
                (new Date(loan.returnDate) - new Date(loan.issueDate)) /
                  (1000 * 60 * 60 * 24)
              );

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
                  <td className="px-4 py-3 text-center">{formatDateDisplay(loan.returnDate)}</td>
                  <td className="px-4 py-3 text-center">{days} days</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-center py-8 text-gray-500">No loan history</p>
      )}
    </div>
  );
}
