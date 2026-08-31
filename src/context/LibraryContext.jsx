import React, { createContext, useReducer, useCallback } from 'react';
import { storageService } from '../services/storageService';
import { generateSeedData } from '../utils/seedData';

export const LibraryContext = createContext();

// Action types
const ACTIONS = {
  // Books
  SET_BOOKS: 'SET_BOOKS',
  ADD_BOOK: 'ADD_BOOK',
  UPDATE_BOOK: 'UPDATE_BOOK',
  ARCHIVE_BOOK: 'ARCHIVE_BOOK',

  // Members
  SET_MEMBERS: 'SET_MEMBERS',
  ADD_MEMBER: 'ADD_MEMBER',
  UPDATE_MEMBER: 'UPDATE_MEMBER',
  DEACTIVATE_MEMBER: 'DEACTIVATE_MEMBER',

  // Loans
  SET_LOANS: 'SET_LOANS',
  ADD_LOAN: 'ADD_LOAN',
  RETURN_LOAN: 'RETURN_LOAN',

  // Loading
  SET_LOADING: 'SET_LOADING',

  // Error
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

const initialState = {
  books: [],
  members: [],
  loans: [],
  loading: true,
  error: null,
};

function libraryReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_BOOKS:
      return { ...state, books: action.payload };

    case ACTIONS.ADD_BOOK: {
      const newBooks = [...state.books, action.payload];
      storageService.saveBooks(newBooks);
      return { ...state, books: newBooks };
    }

    case ACTIONS.UPDATE_BOOK: {
      const updatedBooks = state.books.map((book) =>
        book.id === action.payload.id ? action.payload : book
      );
      storageService.saveBooks(updatedBooks);
      return { ...state, books: updatedBooks };
    }

    case ACTIONS.ARCHIVE_BOOK: {
      const archivedBooks = state.books.map((book) =>
        book.id === action.payload
          ? { ...book, archived: true }
          : book
      );
      storageService.saveBooks(archivedBooks);
      return { ...state, books: archivedBooks };
    }

    case ACTIONS.SET_MEMBERS:
      return { ...state, members: action.payload };

    case ACTIONS.ADD_MEMBER: {
      const newMembers = [...state.members, action.payload];
      storageService.saveMembers(newMembers);
      return { ...state, members: newMembers };
    }

    case ACTIONS.UPDATE_MEMBER: {
      const updatedMembers = state.members.map((member) =>
        member.id === action.payload.id ? action.payload : member
      );
      storageService.saveMembers(updatedMembers);
      return { ...state, members: updatedMembers };
    }

    case ACTIONS.DEACTIVATE_MEMBER: {
      const deactivatedMembers = state.members.map((member) =>
        member.id === action.payload
          ? { ...member, status: 'inactive' }
          : member
      );
      storageService.saveMembers(deactivatedMembers);
      return { ...state, members: deactivatedMembers };
    }

    case ACTIONS.SET_LOANS:
      return { ...state, loans: action.payload };

    case ACTIONS.ADD_LOAN: {
      const newLoans = [...state.loans, action.payload];
      storageService.saveLoans(newLoans);
      return { ...state, loans: newLoans };
    }

    case ACTIONS.RETURN_LOAN: {
      const returnedLoans = state.loans.map((loan) =>
        loan.id === action.payload.loanId
          ? { ...loan, returnDate: action.payload.returnDate }
          : loan
      );
      storageService.saveLoans(returnedLoans);
      return { ...state, loans: returnedLoans };
    }

    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
}

export function LibraryProvider({ children }) {
  const [state, dispatch] = useReducer(libraryReducer, initialState);

  // Initialize storage and load data
  React.useEffect(() => {
    const seedData = generateSeedData();
    storageService.initializeStorage(seedData);

    const books = storageService.getBooks();
    const members = storageService.getMembers();
    const loans = storageService.getLoans();

    dispatch({ type: ACTIONS.SET_BOOKS, payload: books });
    dispatch({ type: ACTIONS.SET_MEMBERS, payload: members });
    dispatch({ type: ACTIONS.SET_LOANS, payload: loans });
    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
  }, []);

  // Book actions
  const addBook = useCallback((book) => {
    dispatch({ type: ACTIONS.ADD_BOOK, payload: book });
  }, []);

  const updateBook = useCallback((book) => {
    dispatch({ type: ACTIONS.UPDATE_BOOK, payload: book });
  }, []);

  const archiveBook = useCallback((bookId) => {
    dispatch({ type: ACTIONS.ARCHIVE_BOOK, payload: bookId });
  }, []);

  // Member actions
  const addMember = useCallback((member) => {
    dispatch({ type: ACTIONS.ADD_MEMBER, payload: member });
  }, []);

  const updateMember = useCallback((member) => {
    dispatch({ type: ACTIONS.UPDATE_MEMBER, payload: member });
  }, []);

  const deactivateMember = useCallback((memberId) => {
    dispatch({ type: ACTIONS.DEACTIVATE_MEMBER, payload: memberId });
  }, []);

  // Loan actions
  const addLoan = useCallback((loan) => {
    dispatch({ type: ACTIONS.ADD_LOAN, payload: loan });
  }, []);

  const returnLoan = useCallback((loanId, returnDate) => {
    dispatch({
      type: ACTIONS.RETURN_LOAN,
      payload: { loanId, returnDate },
    });
  }, []);

  // Error handling
  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERROR });
  }, []);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const seedData = generateSeedData();
    storageService.resetToDefaults(seedData);
    
    dispatch({ type: ACTIONS.SET_BOOKS, payload: seedData.books });
    dispatch({ type: ACTIONS.SET_MEMBERS, payload: seedData.members });
    dispatch({ type: ACTIONS.SET_LOANS, payload: seedData.loans });
  }, []);

  const value = {
    // State
    books: state.books,
    members: state.members,
    loans: state.loans,
    loading: state.loading,
    error: state.error,

    // Book actions
    addBook,
    updateBook,
    archiveBook,

    // Member actions
    addMember,
    updateMember,
    deactivateMember,

    // Loan actions
    addLoan,
    returnLoan,

    // Error actions
    setError,
    clearError,

    // Admin actions
    resetToDefaults,
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
}

export function useLibrary() {
  const context = React.useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return context;
}
