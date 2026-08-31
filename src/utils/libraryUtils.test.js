import { describe, it, expect } from 'vitest';
import {
  getAvailableCopies,
  isBookAvailable,
  isLoanOverdue,

  getMemberActiveLoans,
  canMemberBorrow,
  hasMemberBorrowedBook,
  calculateStatistics,
} from './libraryUtils';

describe('Library Utils', () => {
  // Sample data
  const book = {
    id: 'book1',
    title: 'Test Book',
    totalCopies: 3,
    category: 'Fiction',
  };

  const member = {
    id: 'member1',
    name: 'John Doe',
    status: 'active',
  };

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  describe('getAvailableCopies', () => {
    it('should return total copies when no loans', () => {
      const result = getAvailableCopies(book, []);
      expect(result).toBe(3);
    });

    it('should subtract active loans from total', () => {
      const loans = [
        { bookId: 'book1', memberId: 'member1', returnDate: null },
        { bookId: 'book1', memberId: 'member2', returnDate: null },
      ];
      const result = getAvailableCopies(book, loans);
      expect(result).toBe(1);
    });

    it('should not count returned loans', () => {
      const loans = [
        { bookId: 'book1', memberId: 'member1', returnDate: null },
        { bookId: 'book1', memberId: 'member2', returnDate: '2024-01-01' },
      ];
      const result = getAvailableCopies(book, loans);
      expect(result).toBe(2);
    });
  });

  describe('isBookAvailable', () => {
    it('should return true when copies available', () => {
      const loans = [{ bookId: 'book1', memberId: 'member1', returnDate: null }];
      const result = isBookAvailable(book, loans);
      expect(result).toBe(true);
    });

    it('should return false when all copies checked out', () => {
      const loans = [
        { bookId: 'book1', memberId: 'member1', returnDate: null },
        { bookId: 'book1', memberId: 'member2', returnDate: null },
        { bookId: 'book1', memberId: 'member3', returnDate: null },
      ];
      const result = isBookAvailable(book, loans);
      expect(result).toBe(false);
    });
  });

  describe('isLoanOverdue', () => {
    it('should return false for returned loans', () => {
      const loan = {
        id: 'loan1',
        dueDate: yesterday.toISOString().split('T')[0],
        returnDate: yesterday.toISOString().split('T')[0],
      };
      const result = isLoanOverdue(loan);
      expect(result).toBe(false);
    });

    it('should return false if due date not passed', () => {
      const loan = {
        id: 'loan1',
        dueDate: tomorrow.toISOString().split('T')[0],
        returnDate: null,
      };
      const result = isLoanOverdue(loan);
      expect(result).toBe(false);
    });

    it('should return true if day after due date passed', () => {
      const loan = {
        id: 'loan1',
        dueDate: twoDaysAgo.toISOString().split('T')[0],
        returnDate: null,
      };
      const result = isLoanOverdue(loan);
      expect(result).toBe(true);
    });
  });

  describe('getMemberActiveLoans', () => {
    it('should return only active loans for member', () => {
      const loans = [
        { id: '1', memberId: 'member1', bookId: 'book1', returnDate: null },
        { id: '2', memberId: 'member1', bookId: 'book2', returnDate: null },
        { id: '3', memberId: 'member1', bookId: 'book3', returnDate: '2024-01-01' },
        { id: '4', memberId: 'member2', bookId: 'book1', returnDate: null },
      ];
      const result = getMemberActiveLoans('member1', loans);
      expect(result).toHaveLength(2);
      expect(result.every((l) => l.memberId === 'member1' && !l.returnDate)).toBe(true);
    });
  });

  describe('canMemberBorrow', () => {
    it('should return false for inactive members', () => {
      const inactiveMember = { ...member, status: 'inactive' };
      const result = canMemberBorrow(inactiveMember, []);
      expect(result).toBe(false);
    });

    it('should return false when at loan limit', () => {
      const loans = [
        { memberId: 'member1', returnDate: null },
        { memberId: 'member1', returnDate: null },
        { memberId: 'member1', returnDate: null },
      ];
      const result = canMemberBorrow(member, loans, 3);
      expect(result).toBe(false);
    });

    it('should return true when active and under limit', () => {
      const loans = [
        { memberId: 'member1', returnDate: null },
        { memberId: 'member1', returnDate: null },
      ];
      const result = canMemberBorrow(member, loans, 3);
      expect(result).toBe(true);
    });
  });

  describe('hasMemberBorrowedBook', () => {
    it('should return true for active loan', () => {
      const loans = [{ memberId: 'member1', bookId: 'book1', returnDate: null }];
      const result = hasMemberBorrowedBook('member1', 'book1', loans);
      expect(result).toBe(true);
    });

    it('should return false for returned loan', () => {
      const loans = [{ memberId: 'member1', bookId: 'book1', returnDate: '2024-01-01' }];
      const result = hasMemberBorrowedBook('member1', 'book1', loans);
      expect(result).toBe(false);
    });

    it('should return false for different member or book', () => {
      const loans = [{ memberId: 'member1', bookId: 'book1', returnDate: null }];
      expect(hasMemberBorrowedBook('member2', 'book1', loans)).toBe(false);
      expect(hasMemberBorrowedBook('member1', 'book2', loans)).toBe(false);
    });
  });

  describe('calculateStatistics', () => {
    it('should calculate correct statistics', () => {
      const books = [
        { id: 'b1', title: 'Book 1', totalCopies: 2, archived: false },
        { id: 'b2', title: 'Book 2', totalCopies: 1, archived: false },
        { id: 'b3', title: 'Book 3', totalCopies: 3, archived: true },
      ];
      const members = [
        { id: 'm1', status: 'active' },
        { id: 'm2', status: 'active' },
        { id: 'm3', status: 'inactive' },
      ];
      const loans = [
        { bookId: 'b1', memberId: 'm1', returnDate: null },
        { bookId: 'b2', memberId: 'm2', returnDate: null },
        { bookId: 'b1', memberId: 'm1', returnDate: '2024-01-01' },
      ];

      const result = calculateStatistics(books, members, loans);

      expect(result.totalBookTitles).toBe(2); // exclude archived
      expect(result.totalCopies).toBe(3); // 2 + 1
      expect(result.availableCopies).toBe(1); // 3 - 2 active
      expect(result.activeLoans).toBe(2);
      expect(result.activeMembers).toBe(2);
    });
  });
});
