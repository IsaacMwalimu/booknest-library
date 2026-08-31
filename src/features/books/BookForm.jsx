import React, { useState } from 'react';
import { hasDuplicateISBN } from '../../utils/libraryUtils';

export default function BookForm({ book, onSubmit, onCancel, existingBooks }) {
  const [formData, setFormData] = useState(
    book || {
      title: '',
      author: '',
      isbn: '',
      category: 'Fiction',
      shelfLocation: '',
      totalCopies: 1,
      description: '',
    }
  );

  const [errors, setErrors] = useState({});

  const categories = ['Fiction', 'Non-Fiction', 'Science', 'History', 'Biography', 'Psychology', 'Self-Help', 'Other'];

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else if (hasDuplicateISBN(existingBooks, formData.isbn, book?.id)) {
      newErrors.isbn = 'This ISBN already exists';
    }

    if (!formData.shelfLocation.trim()) {
      newErrors.shelfLocation = 'Shelf location is required';
    }

    if (formData.totalCopies < 1) {
      newErrors.totalCopies = 'Must have at least 1 copy';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'totalCopies' ? parseInt(value, 10) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter book title"
        />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
        <input
          type="text"
          name="author"
          value={formData.author}
          onChange={handleChange}
          className="input-field"
          placeholder="Enter author name"
        />
        {errors.author && <p className="text-red-600 text-sm mt-1">{errors.author}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
        <input
          type="text"
          name="isbn"
          value={formData.isbn}
          onChange={handleChange}
          className="input-field"
          placeholder="e.g., 978-0-123456-78-9"
        />
        {errors.isbn && <p className="text-red-600 text-sm mt-1">{errors.isbn}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="input-field"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies</label>
          <input
            type="number"
            name="totalCopies"
            value={formData.totalCopies}
            onChange={handleChange}
            className="input-field"
            min="1"
          />
          {errors.totalCopies && <p className="text-red-600 text-sm mt-1">{errors.totalCopies}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Shelf Location</label>
        <input
          type="text"
          name="shelfLocation"
          value={formData.shelfLocation}
          onChange={handleChange}
          className="input-field"
          placeholder="e.g., FIC-001"
        />
        {errors.shelfLocation && <p className="text-red-600 text-sm mt-1">{errors.shelfLocation}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="input-field"
          placeholder="Enter book description"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1">
          Cancel
        </button>
        <button type="submit" className="btn-primary flex-1">
          {book ? 'Update' : 'Add'} Book
        </button>
      </div>
    </form>
  );
}
