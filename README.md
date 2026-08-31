# BookNest - Library Management System

A complete, responsive library management system built with React.js. Designed for efficient book and member management with collaborative development in mind.

## Features

### Dashboard
- Real-time statistics: total books, copies, availability, loans, overdue count
- Recent borrowing activity
- Popular books (last 30 days)
- Quick actions for adding books, registering members, and issuing books

### Books Management
- Searchable and filterable book catalogue
- Add, edit, and archive books
- Track total and available copies
- View book details with loan and borrowing history
- Prevent archiving books with active loans
- Validate ISBN uniqueness and required fields

### Members Directory
- Register and manage library members
- Automatically generated member IDs
- Search by name, ID, or email
- View member details with active and past loans
- Deactivate members (prevents borrowing)
- Track member status and activity

### Borrow & Return
- **Issue Book**: Step-by-step workflow to borrow books
  - Select member and verify status/loan count
  - Select available book
  - Confirm issue with automatic due date calculation (14 days)
  - Validation: max 3 active loans, active members only, no duplicates
  
- **Return Book**: Find and return active loans
  - Search by member, book, or loan ID
  - View loan details and overdue status
  - Confirm return and update availability

- **Active Loans**: View all current borrowing transactions
- **Overdue Loans**: Track overdue loans with days overdue
- **Loan History**: Browse all completed transactions

### Reports
- Date-range filtering for flexible analysis
- Charts: borrowing trends (weekly), borrowing by category (pie chart)
- Key metrics: loans issued, returned, active, unique books
- Most borrowed books (top 5)
- Detailed transactions table
- CSV export with proper escaping
- Print-friendly report view

## Technical Architecture

### Stack
- **Frontend**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS with custom components
- **State Management**: Context API with useReducer
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Charts**: Recharts
- **Build Tool**: Vite
- **Data Persistence**: localStorage (with abstraction layer for easy backend migration)

### Project Structure

```
src/
├── components/          # Shared UI components
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   ├── Header.jsx
│   ├── Modal.jsx
│   ├── ConfirmDialog.jsx
│   ├── StatusBadge.jsx
│   └── SearchBar.jsx
│
├── context/            # Global state management
│   └── LibraryContext.jsx  # Context + reducer + hooks
│
├── features/           # Feature-specific components
│   ├── books/
│   │   ├── BookForm.jsx
│   │   └── BookDetails.jsx
│   ├── members/
│   │   ├── MemberForm.jsx
│   │   └── MemberDetails.jsx
│   └── loans/
│       ├── IssueLoan.jsx
│       ├── ReturnLoan.jsx
│       ├── ActiveLoans.jsx
│       ├── OverdueLoans.jsx
│       └── LoanHistory.jsx
│
├── pages/              # Page components for each route
│   ├── Dashboard.jsx
│   ├── Books.jsx
│   ├── Members.jsx
│   ├── BorrowReturn.jsx
│   └── Reports.jsx
│
├── services/           # Business logic & data layer
│   └── storageService.js
│
├── utils/              # Utilities and helpers
│   ├── libraryUtils.js    # Borrowing rules, calculations
│   ├── seedData.js        # Demo data generator
│   └── libraryUtils.test.js
│
├── App.jsx            # Router configuration
├── main.jsx           # React entry point
└── index.css          # Tailwind configuration
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd library
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Scripts

```bash
npm run dev          # Start development server (Vite)
npm run build        # Build for production
npm run preview      # Preview production build locally
npm run lint         # Lint with Oxlint
npm test             # Run tests (configure as needed)
```

## Demo Data

The application seeds with demo data on first launch:
- 8 sample books across different categories
- 5 sample members (4 active, 1 inactive)
- 10 sample loans including active, overdue, and returned states
- Dates are generated relative to today for realistic demonstrations

## About localStorage

**⚠️ Important**: This application uses browser `localStorage` for demo data storage. This is **NOT suitable for production** because:

- **Browser-specific**: Data doesn't sync across devices
- **Single-user**: No multiuser support
- **No authentication**: Demo mode only
- **Insecure**: No encryption

## Student Collaboration

See [CONTRIBUTING.md](./CONTRIBUTING.md) for team coordination guidelines.

## License

Educational project
