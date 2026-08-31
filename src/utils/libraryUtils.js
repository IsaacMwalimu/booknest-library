/**
 * Library utility functions
 * Contains business logic for books, members, and loans
 */

/**
 * Calculate available copies of a book
 * Available = Total - Active Loans
 */
export function getAvailableCopies(book, loans) {
  const activeLoans = loans.filter(
    (loan) => loan.bookId === book.id && !loan.returnDate
  );
  return Math.max(0, book.totalCopies - activeLoans.length);
}

/**
 * Check if a book is available (has at least one copy)
 */
export function isBookAvailable(book, loans) {
  return getAvailableCopies(book, loans) > 0;
}

/**
 * Check if a loan is overdue
 * A loan is overdue the day after its due date
 */
export function isLoanOverdue(loan, referenceDate = new Date()) {
  if (loan.returnDate) return false; // Returned loans are never overdue

  const dueDate = new Date(loan.dueDate);
  const dayAfterDue = new Date(dueDate);
  dayAfterDue.setDate(dayAfterDue.getDate() + 1);

  return referenceDate >= dayAfterDue;
}

/**
 * Calculate days overdue
 */
export function getDaysOverdue(loan, referenceDate = new Date()) {
  if (!isLoanOverdue(loan, referenceDate)) return 0;

  const dueDate = new Date(loan.dueDate);
  const dayAfterDue = new Date(dueDate);
  dayAfterDue.setDate(dayAfterDue.getDate() + 1);

  const diffTime = referenceDate - dayAfterDue;
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Get member's active loans
 */
export function getMemberActiveLoans(memberId, loans) {
  return loans.filter(
    (loan) => loan.memberId === memberId && !loan.returnDate
  );
}

/**
 * Check if member can borrow (under limit and active)
 */
export function canMemberBorrow(member, loans, loanLimit = 3) {
  if (member.status !== 'active') return false;

  const activeLoanCount = getMemberActiveLoans(member.id, loans).length;
  return activeLoanCount < loanLimit;
}

/**
 * Check if member already has an active loan for a book
 */
export function hasMemberBorrowedBook(memberId, bookId, loans) {
  return loans.some(
    (loan) =>
      loan.memberId === memberId &&
      loan.bookId === bookId &&
      !loan.returnDate
  );
}

/**
 * Get books by category
 */
export function getBooksByCategory(books, category) {
  return books.filter((book) => book.category === category);
}

/**
 * Get most borrowed books during a period
 */
export function getMostBorrowedBooks(books, loans, startDate, endDate, limit = 5) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const bookBorrowCount = {};

  loans.forEach((loan) => {
    const issueDate = new Date(loan.issueDate);
    if (issueDate >= start && issueDate <= end) {
      bookBorrowCount[loan.bookId] = (bookBorrowCount[loan.bookId] || 0) + 1;
    }
  });

  return books
    .filter((book) => bookBorrowCount[book.id])
    .sort((a, b) => bookBorrowCount[b.id] - bookBorrowCount[a.id])
    .slice(0, limit);
}

/**
 * Get loans during a period
 */
export function getLoansInPeriod(loans, startDate, endDate, filter = 'issued') {
  const start = new Date(startDate);
  const end = new Date(endDate);

  return loans.filter((loan) => {
    if (filter === 'issued') {
      const issueDate = new Date(loan.issueDate);
      return issueDate >= start && issueDate <= end;
    } else if (filter === 'returned') {
      if (!loan.returnDate) return false;
      const returnDate = new Date(loan.returnDate);
      return returnDate >= start && returnDate <= end;
    }
    return false;
  });
}

/**
 * Get categories from books
 */
export function getCategories(books) {
  const categories = new Set(books.map((book) => book.category));
  return Array.from(categories).sort();
}

/**
 * Format currency (for potential future use with fines)
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Format date for display
 */
export function formatDateDisplay(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Generate unique member ID
 */
export function generateMemberId(existingMembers) {
  const numbers = existingMembers
    .map((m) => parseInt(m.id.replace('M', ''), 10))
    .filter((n) => !isNaN(n));

  const nextNumber = Math.max(...numbers, 0) + 1;
  return `M${String(nextNumber).padStart(3, '0')}`;
}

/**
 * Validate ISBN format (basic check)
 */
export function isValidISBN(isbn) {
  const cleaned = isbn.replace(/[-\s]/g, '');
  return /^\d{10}(\d{3})?$/.test(cleaned);
}

/**
 * Check for duplicate ISBN
 */
export function hasDuplicateISBN(books, newISBN, excludeId = null) {
  return books.some(
    (book) =>
      book.isbn.replace(/[-\s]/g, '') === newISBN.replace(/[-\s]/g, '') &&
      book.id !== excludeId
  );
}

/**
 * Get borrowing by category for a period
 */
export function getBorrowingByCategory(books, loans, startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const categoryData = {};

  getCategories(books).forEach((category) => {
    categoryData[category] = 0;
  });

  loans.forEach((loan) => {
    const issueDate = new Date(loan.issueDate);
    if (issueDate >= start && issueDate <= end) {
      const book = books.find((b) => b.id === loan.bookId);
      if (book) {
        categoryData[book.category]++;
      }
    }
  });

  return categoryData;
}

/**
 * Get borrowing trend data (daily/weekly)
 */
export function getBorrowingTrendData(loans, startDate, endDate, groupBy = 'week') {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const data = {};

  loans.forEach((loan) => {
    const issueDate = new Date(loan.issueDate);
    if (issueDate >= start && issueDate <= end) {
      let key;

      if (groupBy === 'day') {
        key = issueDate.toISOString().split('T')[0];
      } else if (groupBy === 'week') {
        const weekStart = new Date(issueDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        key = weekStart.toISOString().split('T')[0];
      } else if (groupBy === 'month') {
        key = issueDate.toISOString().split('T')[0].substring(0, 7);
      }

      data[key] = (data[key] || 0) + 1;
    }
  });

  return Object.entries(data)
    .sort((a, b) => new Date(a[0]) - new Date(b[0]))
    .map(([date, count]) => ({
      date: formatDateDisplay(date),
      loans: count,
    }));
}

/**
 * Calculate statistics
 */
export function calculateStatistics(books, members, loans) {
  const activeLoans = loans.filter((loan) => !loan.returnDate);
  const overdueLoans = activeLoans.filter((loan) => isLoanOverdue(loan));

  return {
    totalBookTitles: books.filter((b) => !b.archived).length,
    totalCopies: books
      .filter((b) => !b.archived)
      .reduce((sum, b) => sum + b.totalCopies, 0),
    availableCopies: books
      .filter((b) => !b.archived)
      .reduce((sum, b) => sum + getAvailableCopies(b, loans), 0),
    activeLoans: activeLoans.length,
    overdueLoans: overdueLoans.length,
    activeMembers: members.filter((m) => m.status === 'active').length,
  };
}
