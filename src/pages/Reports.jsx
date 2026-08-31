import React, { useState, useMemo } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { Layout } from '../components';
import {
  getLoansInPeriod,
  getMostBorrowedBooks,
  getBorrowingByCategory,
  getBorrowingTrendData,
  formatDateDisplay,
} from '../utils/libraryUtils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Reports() {
  const { books, members, loans } = useLibrary();

  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [startDate, setStartDate] = useState(thirtyDaysAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  const loansIssued = useMemo(
    () => getLoansInPeriod(loans, startDate, endDate, 'issued'),
    [loans, startDate, endDate]
  );

  const loansReturned = useMemo(
    () => getLoansInPeriod(loans, startDate, endDate, 'returned'),
    [loans, startDate, endDate]
  );

  const activeLoans = useMemo(() => loans.filter((l) => !l.returnDate), [loans]);

  const mostBorrowed = useMemo(
    () => getMostBorrowedBooks(books, loans, startDate, endDate, 5),
    [books, loans, startDate, endDate]
  );

  const borrowByCategory = useMemo(
    () => getBorrowingByCategory(books, loans, startDate, endDate),
    [books, loans, startDate, endDate]
  );

  const borrowTrend = useMemo(
    () => getBorrowingTrendData(loans, startDate, endDate, 'week'),
    [loans, startDate, endDate]
  );

  const categoryData = Object.entries(borrowByCategory).map(([name, value]) => ({
    name,
    value,
  }));

  const handleReset = () => {
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
    setEndDate(today.toISOString().split('T')[0]);
  };

  const exportToCSV = () => {
    const headers = ['Member', 'Book', 'Author', 'Issue Date', 'Return Date', 'Status'];
    const rows = loansIssued.map((loan) => {
      const book = books.find((b) => b.id === loan.bookId);
      const member = members.find((m) => m.id === loan.memberId);
      const returned = loansReturned.find((l) => l.id === loan.id);

      return [
        member?.name || '',
        book?.title || '',
        book?.author || '',
        formatDateDisplay(loan.issueDate),
        returned ? formatDateDisplay(returned.returnDate) : '-',
        returned ? 'Returned' : 'Active',
      ];
    });

    const csv = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"` ).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `library-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <Layout currentPage="Reports">
      <div className="space-y-6">
        {/* Filters */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Filter by Date Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="flex gap-2 items-end">
              <button
                onClick={handleReset}
                className="btn-secondary flex items-center justify-center gap-2 flex-1"
              >
                <RotateCcw size={18} />
                Reset
              </button>
              <button
                onClick={exportToCSV}
                className="btn-primary flex items-center justify-center gap-2 flex-1"
              >
                <Download size={18} />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Loans Issued</p>
            <p className="text-3xl font-bold text-indigo-600">{loansIssued.length}</p>
            <p className="text-xs text-gray-500 mt-2">
              {formatDateDisplay(startDate)} to {formatDateDisplay(endDate)}
            </p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Loans Returned</p>
            <p className="text-3xl font-bold text-green-600">{loansReturned.length}</p>
            <p className="text-xs text-gray-500 mt-2">Within selected period</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Current Active</p>
            <p className="text-3xl font-bold text-blue-600">{activeLoans.length}</p>
            <p className="text-xs text-gray-500 mt-2">Snapshot at today</p>
          </div>
          <div className="card">
            <p className="text-gray-600 text-sm mb-1">Unique Books</p>
            <p className="text-3xl font-bold text-amber-600">
              {new Set(loansIssued.map((l) => l.bookId)).size}
            </p>
            <p className="text-xs text-gray-500 mt-2">Borrowed in period</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Borrowing Trend */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Borrowing Trend (Weekly)</h3>
            {borrowTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={borrowTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="loans"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ fill: '#4f46e5' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-gray-500">No data available</p>
            )}
          </div>

          {/* Borrowing by Category */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Borrowing by Category</h3>
            {categoryData.length > 0 && categoryData.some((d) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name} (${entry.value})`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center py-12 text-gray-500">No data available</p>
            )}
          </div>
        </div>

        {/* Most Borrowed Books */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Most Borrowed Books</h3>
          {mostBorrowed.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {mostBorrowed.map((book, index) => {
                const borrowCount = loansIssued.filter((l) => l.bookId === book.id).length;
                return (
                  <div key={book.id} className="bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-200">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">#{index + 1}</div>
                    <p className="font-medium text-gray-900 mb-1">{book.title}</p>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <p className="text-2xl font-bold text-indigo-600">{borrowCount}</p>
                    <p className="text-xs text-gray-600">times borrowed</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500">No borrowing data available</p>
          )}
        </div>

        {/* Detailed Transactions Table */}
        <div className="card overflow-x-auto">
          <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
          {loansIssued.length > 0 ? (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Member</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Book</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Issue Date</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Return Date</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {loansIssued.map((loan) => {
                  const book = books.find((b) => b.id === loan.bookId);
                  const member = members.find((m) => m.id === loan.memberId);
                  const returned = loansReturned.find((l) => l.id === loan.id);

                  return (
                    <tr key={loan.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{member?.name}</td>
                      <td className="px-4 py-3 text-gray-900">{book?.title}</td>
                      <td className="px-4 py-3 text-center">
                        {formatDateDisplay(loan.issueDate)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {returned ? formatDateDisplay(returned.returnDate) : '-'}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            returned
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {returned ? 'Returned' : 'Active'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="text-center py-8 text-gray-500">No transactions in this period</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
