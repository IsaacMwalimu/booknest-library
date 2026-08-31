import React, { useState, useMemo } from 'react';
import { Plus, Edit2, Archive, Eye } from 'lucide-react';
import { useLibrary } from '../context/LibraryContext';
import { Layout, SearchBar, StatusBadge, Modal, ConfirmDialog } from '../components';
import {
  getAvailableCopies,
  isBookAvailable,
  getCategories,
} from '../utils/libraryUtils';
import BookForm from '../features/books/BookForm';
import BookDetails from '../features/books/BookDetails';

const ITEMS_PER_PAGE = 10;

export default function Books() {
  const { books, loans, addBook, updateBook, archiveBook } = useLibrary();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const categories = getCategories(books.filter((b) => !b.archived));

  // Filter and search
  const filteredBooks = useMemo(() => {
    return books
      .filter((b) => !b.archived) // Hide archived books from main list
      .filter((book) => {
        const matchesSearch =
          book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          book.isbn.includes(searchTerm);

        const matchesCategory = !selectedCategory || book.category === selectedCategory;

        let matchesAvailability = true;
        if (availabilityFilter) {
          const isAvailable = isBookAvailable(book, loans);
          matchesAvailability =
            (availabilityFilter === 'available' && isAvailable) ||
            (availabilityFilter === 'unavailable' && !isAvailable);
        }

        return matchesSearch && matchesCategory && matchesAvailability;
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [books, searchTerm, selectedCategory, availabilityFilter, loans]);

  // Pagination
  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddBook = (bookData) => {
    addBook({
      id: Math.random().toString(36).substr(2, 9),
      ...bookData,
      archived: false,
      createdAt: new Date().toISOString().split('T')[0],
    });
    setIsFormOpen(false);
  };

  const handleEditBook = (bookData) => {
    updateBook({
      ...selectedBook,
      ...bookData,
    });
    setIsFormOpen(false);
    setSelectedBook(null);
  };

  const handleArchiveClick = (book) => {
    const activeLoans = loans.filter((l) => l.bookId === book.id && !l.returnDate);
    if (activeLoans.length > 0) {
      alert('Cannot archive a book with active loans. Return all copies first.');
      return;
    }
    setSelectedBook(book);
    setIsArchiveDialogOpen(true);
  };

  const handleConfirmArchive = () => {
    if (selectedBook) {
      archiveBook(selectedBook.id);
      setIsArchiveDialogOpen(false);
      setSelectedBook(null);
    }
  };

  return (
    <Layout currentPage="Books">
      <div className="space-y-6">
        {/* Header with Add Button */}
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Book Catalogue</h3>
            <p className="text-sm text-gray-600">
              {filteredBooks.length} of {books.filter((b) => !b.archived).length} books
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedBook(null);
              setIsFormOpen(true);
            }}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Add Book
          </button>
        </div>

        {/* Filters */}
        <div className="card">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchBar
              placeholder="Search by title, author, or ISBN..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              value={availabilityFilter}
              onChange={(e) => {
                setAvailabilityFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field"
            >
              <option value="">All Books</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        {/* Books Table */}
        {paginatedBooks.length > 0 ? (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Title</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Author</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Category</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Copies</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Available</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Status</th>
                  <th className="px-4 py-3 text-center font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedBooks.map((book) => {
                  const available = getAvailableCopies(book, loans);
                  const isAvailable = available > 0;

                  return (
                    <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">{book.title}</td>
                      <td className="px-4 py-3 text-gray-700">{book.author}</td>
                      <td className="px-4 py-3 text-gray-600">{book.category}</td>
                      <td className="px-4 py-3 text-center">{book.totalCopies}</td>
                      <td className="px-4 py-3 text-center font-semibold">{available}</td>
                      <td className="px-4 py-3 text-center">
                        <StatusBadge status={isAvailable ? 'available' : 'unavailable'} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedBook(book);
                              setIsDetailsOpen(true);
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="View details"
                          >
                            <Eye size={18} className="text-indigo-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBook(book);
                              setIsFormOpen(true);
                            }}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Edit"
                          >
                            <Edit2 size={18} className="text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleArchiveClick(book)}
                            className="p-1 hover:bg-gray-200 rounded"
                            title="Archive"
                          >
                            <Archive size={18} className="text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="btn-secondary"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="btn-secondary"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="card text-center py-12">
            <p className="text-gray-600">No books found matching your search criteria.</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <Modal
        isOpen={isFormOpen}
        title={selectedBook ? 'Edit Book' : 'Add New Book'}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBook(null);
        }}
      >
        <BookForm
          book={selectedBook}
          onSubmit={selectedBook ? handleEditBook : handleAddBook}
          onCancel={() => {
            setIsFormOpen(false);
            setSelectedBook(null);
          }}
          existingBooks={books}
        />
      </Modal>

      {selectedBook && (
        <Modal
          isOpen={isDetailsOpen}
          title={selectedBook.title}
          onClose={() => setIsDetailsOpen(false)}
        >
          <BookDetails book={selectedBook} onClose={() => setIsDetailsOpen(false)} />
        </Modal>
      )}

      <ConfirmDialog
        isOpen={isArchiveDialogOpen}
        title="Archive Book"
        message={`Archive "${selectedBook?.title}"? Archived books will be hidden from the catalogue but their records will be preserved.`}
        confirmText="Archive"
        isDangerous={true}
        onConfirm={handleConfirmArchive}
        onCancel={() => {
          setIsArchiveDialogOpen(false);
          setSelectedBook(null);
        }}
      />
    </Layout>
  );
}
