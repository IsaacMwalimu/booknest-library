/**
 * Seed data generator
 * Creates realistic demo data relative to the current date
 * Generates books, members, and loans with various states
 */

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

const today = new Date();

const generateBooks = () => [
  {
    id: generateId(),
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '978-0-7432-7356-5',
    category: 'Fiction',
    shelfLocation: 'FIC-001',
    totalCopies: 3,
    description: 'A classic American novel set in the Jazz Age',
    archived: false,
    createdAt: formatDate(addDays(today, -180)),
  },
  {
    id: generateId(),
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '978-0-06-112008-4',
    category: 'Fiction',
    shelfLocation: 'FIC-002',
    totalCopies: 2,
    description: 'A gripping story of racial injustice and childhood innocence',
    archived: false,
    createdAt: formatDate(addDays(today, -175)),
  },
  {
    id: generateId(),
    title: '1984',
    author: 'George Orwell',
    isbn: '978-0-452-26423-5',
    category: 'Fiction',
    shelfLocation: 'FIC-003',
    totalCopies: 4,
    description: 'A dystopian novel about totalitarianism',
    archived: false,
    createdAt: formatDate(addDays(today, -160)),
  },
  {
    id: generateId(),
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    isbn: '978-0-06-231609-7',
    category: 'Non-Fiction',
    shelfLocation: 'NFC-001',
    totalCopies: 2,
    description: 'A brief history of humankind',
    archived: false,
    createdAt: formatDate(addDays(today, -150)),
  },
  {
    id: generateId(),
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    isbn: '978-0-374-27563-1',
    category: 'Psychology',
    shelfLocation: 'PSY-001',
    totalCopies: 1,
    description: 'Explore the two systems of human thought',
    archived: false,
    createdAt: formatDate(addDays(today, -145)),
  },
  {
    id: generateId(),
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    isbn: '978-0-316-76948-0',
    category: 'Fiction',
    shelfLocation: 'FIC-004',
    totalCopies: 5,
    description: 'A timeless coming-of-age novel',
    archived: false,
    createdAt: formatDate(addDays(today, -140)),
  },
  {
    id: generateId(),
    title: 'Atomic Habits',
    author: 'James Clear',
    isbn: '978-0-7352-1129-3',
    category: 'Self-Help',
    shelfLocation: 'SH-001',
    totalCopies: 3,
    description: 'Build better habits and break bad ones',
    archived: false,
    createdAt: formatDate(addDays(today, -130)),
  },
  {
    id: generateId(),
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    isbn: '978-0-141-43951-8',
    category: 'Fiction',
    shelfLocation: 'FIC-005',
    totalCopies: 2,
    description: 'A romantic novel of manners',
    archived: false,
    createdAt: formatDate(addDays(today, -125)),
  },
];

const generateMembers = () => [
  {
    id: 'M001',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '555-0101',
    membershipDate: formatDate(addDays(today, -365)),
    status: 'active',
    createdAt: formatDate(addDays(today, -365)),
  },
  {
    id: 'M002',
    name: 'Bob Smith',
    email: 'bob.smith@example.com',
    phone: '555-0102',
    membershipDate: formatDate(addDays(today, -200)),
    status: 'active',
    createdAt: formatDate(addDays(today, -200)),
  },
  {
    id: 'M003',
    name: 'Carol Davis',
    email: 'carol.davis@example.com',
    phone: '555-0103',
    membershipDate: formatDate(addDays(today, -180)),
    status: 'active',
    createdAt: formatDate(addDays(today, -180)),
  },
  {
    id: 'M004',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    phone: '555-0104',
    membershipDate: formatDate(addDays(today, -90)),
    status: 'active',
    createdAt: formatDate(addDays(today, -90)),
  },
  {
    id: 'M005',
    name: 'Emma Martinez',
    email: 'emma.martinez@example.com',
    phone: '555-0105',
    membershipDate: formatDate(addDays(today, -60)),
    status: 'inactive',
    createdAt: formatDate(addDays(today, -60)),
  },
];

const generateLoans = (books, _members) => {
  const gautbookId = books[0].id;
  const mockingbirdId = books[1].id;
  const orwellId = books[2].id;
  const sapId = books[3].id;
  const catcherId = books[5].id;

  return [
    // Active loans
    {
      id: generateId(),
      bookId: gautbookId,
      memberId: 'M001',
      issueDate: formatDate(addDays(today, -5)),
      dueDate: formatDate(addDays(today, 9)),
      returnDate: null,
      createdAt: formatDate(addDays(today, -5)),
    },
    {
      id: generateId(),
      bookId: mockingbirdId,
      memberId: 'M002',
      issueDate: formatDate(addDays(today, -10)),
      dueDate: formatDate(addDays(today, 4)),
      returnDate: null,
      createdAt: formatDate(addDays(today, -10)),
    },
    {
      id: generateId(),
      bookId: orwellId,
      memberId: 'M001',
      issueDate: formatDate(addDays(today, -3)),
      dueDate: formatDate(addDays(today, 11)),
      returnDate: null,
      createdAt: formatDate(addDays(today, -3)),
    },
    {
      id: generateId(),
      bookId: sapId,
      memberId: 'M003',
      issueDate: formatDate(addDays(today, -2)),
      dueDate: formatDate(addDays(today, 12)),
      returnDate: null,
      createdAt: formatDate(addDays(today, -2)),
    },
    {
      id: generateId(),
      bookId: orwellId,
      memberId: 'M002',
      issueDate: formatDate(addDays(today, -1)),
      dueDate: formatDate(addDays(today, 13)),
      returnDate: null,
      createdAt: formatDate(addDays(today, -1)),
    },
    {
      id: generateId(),
      bookId: catcherId,
      memberId: 'M004',
      issueDate: formatDate(addDays(today, -7)),
      dueDate: formatDate(addDays(today, 7)),
      returnDate: null,
      createdAt: formatDate(addDays(today, -7)),
    },
    // Overdue loan
    {
      id: generateId(),
      bookId: books[6].id,
      memberId: 'M001',
      issueDate: formatDate(addDays(today, -20)),
      dueDate: formatDate(addDays(today, -6)),
      returnDate: null,
      createdAt: formatDate(addDays(today, -20)),
    },
    // Returned loans
    {
      id: generateId(),
      bookId: gautbookId,
      memberId: 'M002',
      issueDate: formatDate(addDays(today, -40)),
      dueDate: formatDate(addDays(today, -26)),
      returnDate: formatDate(addDays(today, -28)),
      createdAt: formatDate(addDays(today, -40)),
    },
    {
      id: generateId(),
      bookId: books[3].id,
      memberId: 'M004',
      issueDate: formatDate(addDays(today, -35)),
      dueDate: formatDate(addDays(today, -21)),
      returnDate: formatDate(addDays(today, -22)),
      createdAt: formatDate(addDays(today, -35)),
    },
    {
      id: generateId(),
      bookId: books[7].id,
      memberId: 'M003',
      issueDate: formatDate(addDays(today, -50)),
      dueDate: formatDate(addDays(today, -36)),
      returnDate: formatDate(addDays(today, -37)),
      createdAt: formatDate(addDays(today, -50)),
    },
  ];
};

export function generateSeedData() {
  const books = generateBooks();
  const members = generateMembers();
  const loans = generateLoans(books, members);

  return {
    books,
    members,
    loans,
  };
}
