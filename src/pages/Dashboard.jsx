import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  AlertCircle,
  Plus,
  TrendingUp,
} from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { Layout } from '../components';
import {
  calculateStatistics,
  isLoanOverdue,
  getMostBorrowedBooks,
  formatDateDisplay,
} from '../utils/libraryUtils';

export default function Dashboard() {
  const navigate = useNavigate();
  const { books, members, loans } = useLibrary();

  const stats = calculateStatistics(books, members, loans);
  const recentLoans = loans
    .slice()
    .reverse()
    .slice(0, 5);

  const today = new Date();
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const popularBooks = getMostBorrowedBooks(books, loans, thirtyDaysAgo, today, 3);

  const quickActions = [
    { label: 'Add Book', action: () => navigate('/books?action=add'), color: 'indigo' },
    { label: 'Register Member', action: () => navigate('/members?action=add'), color: 'indigo' },
    { label: 'Issue Book', action: () => navigate('/borrow-return?tab=issue'), color: 'indigo' },
  ];

  return (
    <Layout currentPage="Dashboard">
      <div className="space-y-6">
        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            label="Total Book Titles"
            value={stats.totalBookTitles}
            icon={<BookOpen className="text-indigo-600" />}
          />
          <StatCard
            label="Total Copies"
            value={stats.totalCopies}
            icon={<BookOpen className="text-blue-600" />}
          />
          <StatCard
            label="Available Copies"
            value={stats.availableCopies}
            icon={<BookOpen className="text-green-600" />}
          />
          <StatCard
            label="Active Loans"
            value={stats.activeLoans}
            icon={<TrendingUp className="text-indigo-600" />}
          />
          <StatCard
            label="Overdue Loans"
            value={stats.overdueLoans}
            icon={<AlertCircle className="text-red-600" />}
            isAlert={stats.overdueLoans > 0}
          />
          <StatCard
            label="Active Members"
            value={stats.activeMembers}
            icon={<Users className="text-green-600" />}
          />
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.action}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Popular Books */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Popular Books (Last 30 Days)</h3>
            {popularBooks.length > 0 ? (
              <ul className="space-y-3">
                {popularBooks.map((book) => (
                  <li
                    key={book.id}
                    className="flex justify-between items-start pb-3 border-b border-gray-200 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900">{book.title}</p>
                      <p className="text-sm text-gray-600">{book.author}</p>
                    </div>
                    <span className="text-sm font-semibold text-indigo-600">Borrowed</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No borrowing data available</p>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            {recentLoans.length > 0 ? (
              <ul className="space-y-3">
                {recentLoans.map((loan) => {
                  const book = books.find((b) => b.id === loan.bookId);
                  const member = members.find((m) => m.id === loan.memberId);
                  const isOverdue = isLoanOverdue(loan);

                  return (
                    <li
                      key={loan.id}
                      className="flex justify-between items-start pb-3 border-b border-gray-200 last:border-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{member?.name}</p>
                        <p className="text-sm text-gray-600">
                          {loan.returnDate ? 'Returned' : 'Borrowed'}: {book?.title}
                        </p>
                        {isOverdue && (
                          <p className="text-xs text-red-600 font-semibold">Overdue</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {formatDateDisplay(loan.issueDate)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-gray-500">No recent activity</p>
            )}
          </div>
        </div>


      </div>
    </Layout>
  );
}

function StatCard({ label, value, icon, isAlert = false }) {
  return (
    <div className={`card ${isAlert ? 'border-l-4 border-red-600' : ''}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl opacity-20">{icon}</div>
      </div>
    </div>
  );
}
