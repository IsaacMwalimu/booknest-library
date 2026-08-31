/**
 * Storage Service
 * Abstracts localStorage operations for the application.
 * This layer can be replaced with backend API calls without changing component code.
 */

const STORAGE_KEYS = {
  BOOKS: 'booknest_books',
  MEMBERS: 'booknest_members',
  LOANS: 'booknest_loans',
  INITIALIZED: 'booknest_initialized',
};

/**
 * Parse stored data safely, handling invalid JSON
 */
function getSafeItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error parsing storage item "${key}":`, error);
    return defaultValue;
  }
}

/**
 * Store data safely
 */
function setSafeItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error storing item "${key}":`, error);
  }
}

export const storageService = {
  /**
   * Initialize storage with demo data if empty
   */
  initializeStorage(seedData) {
    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      setSafeItem(STORAGE_KEYS.BOOKS, seedData.books);
      setSafeItem(STORAGE_KEYS.MEMBERS, seedData.members);
      setSafeItem(STORAGE_KEYS.LOANS, seedData.loans);
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  },

  /**
   * Reset all data and reinitialize with seed data
   */
  resetToDefaults(seedData) {
    localStorage.removeItem(STORAGE_KEYS.INITIALIZED);
    setSafeItem(STORAGE_KEYS.BOOKS, seedData.books);
    setSafeItem(STORAGE_KEYS.MEMBERS, seedData.members);
    setSafeItem(STORAGE_KEYS.LOANS, seedData.loans);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  },

  /**
   * Book operations
   */
  getBooks() {
    return getSafeItem(STORAGE_KEYS.BOOKS, []);
  },

  saveBooks(books) {
    setSafeItem(STORAGE_KEYS.BOOKS, books);
  },

  /**
   * Member operations
   */
  getMembers() {
    return getSafeItem(STORAGE_KEYS.MEMBERS, []);
  },

  saveMembers(members) {
    setSafeItem(STORAGE_KEYS.MEMBERS, members);
  },

  /**
   * Loan operations
   */
  getLoans() {
    return getSafeItem(STORAGE_KEYS.LOANS, []);
  },

  saveLoans(loans) {
    setSafeItem(STORAGE_KEYS.LOANS, loans);
  },

  /**
   * Clear all storage (for testing/reset)
   */
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};
