# BookNest Team Assignments

## Team A: Dashboard & Shared Layout

**Primary Components**: Dashboard, Layout, Sidebar, Header, Modal, Reusable UI

**Files to Manage**:
- `src/pages/Dashboard.jsx` - Main statistics and quick actions
- `src/components/Layout.jsx` - Main wrapper component
- `src/components/Sidebar.jsx` - Navigation sidebar
- `src/components/Header.jsx` - Top header with menu
- `src/components/Modal.jsx` - Reusable modal dialog
- `src/components/ConfirmDialog.jsx` - Confirmation dialogs
- `src/components/StatusBadge.jsx` - Status indicators
- `src/components/SearchBar.jsx` - Reusable search input
- `src/index.css` - Tailwind component classes

**Key Responsibilities**:
- Maintain responsive design
- Handle mobile menu toggling
- Show error banners in header
- Calculate and display statistics
- Manage quick action navigation
- Ensure consistent styling across app

**Example Branch**: `a/dashboard-statistics`, `a/sidebar-responsive`, `a/header-improvements`

**Example Acceptance Criteria**:
- [ ] Dashboard shows all 6 statistics accurately (real data, not hardcoded)
- [ ] Statistics update when data changes (add/remove books, loans, etc.)
- [ ] Sidebar toggles on mobile when menu button clicked
- [ ] Active link in sidebar shows with visual indicator
- [ ] Modal opens/closes smoothly without console errors
- [ ] Error banner displays and dismisses correctly
- [ ] Quick action buttons navigate to correct pages
- [ ] Responsive on mobile (375px), tablet (768px), desktop (1024px+)
- [ ] No console warnings or errors
- [ ] All new components documented in component comments

---

## Team B: Books Management

**Primary Components**: Books page, BookForm, BookDetails

**Files to Manage**:
- `src/pages/Books.jsx` - Books list, search, filter, CRUD
- `src/features/books/BookForm.jsx` - Add/edit form
- `src/features/books/BookDetails.jsx` - View details modal

**Key Responsibilities**:
- Search by title, author, ISBN
- Filter by category and availability
- Validate form inputs (required, unique ISBN)
- Archive books (prevent if active loans)
- Calculate available copies dynamically
- Show loan history for each book
- Pagination (10 per page)

**Example Branch**: `b/book-archive-feature`, `b/isbn-validation`, `b/book-details-modal`

**Example Acceptance Criteria**:
- [ ] Search finds books by title, author, and ISBN
- [ ] Category filter updates table without full page reload
- [ ] Availability filter shows "Available" and "Unavailable" only
- [ ] Add Book form validates all required fields
- [ ] ISBN uniqueness check prevents duplicates (edit excludes current book)
- [ ] Cannot archive books with active loans (validation message shown)
- [ ] Available copies calculated as: totalCopies - active loans count
- [ ] Book details modal shows current loans with due dates
- [ ] Book details shows borrowing history with member names
- [ ] Pagination works correctly (navigate pages, show 10 per page)
- [ ] Edit form pre-populates with current data
- [ ] Form handles description as optional field
- [ ] No console errors on any interaction

---

## Team C: Members Directory

**Primary Components**: Members page, MemberForm, MemberDetails

**Files to Manage**:
- `src/pages/Members.jsx` - Members list, search, filter, CRUD
- `src/features/members/MemberForm.jsx` - Register/edit form
- `src/features/members/MemberDetails.jsx` - View details modal

**Key Responsibilities**:
- Search by name, ID, email
- Filter by status (active/inactive)
- Auto-generate member IDs (M001, M002, etc.)
- Validate email uniqueness and format
- Deactivate members (prevent if active loans)
- Show active and past loans per member
- Pagination (10 per page)

**Example Branch**: `c/member-deactivation`, `c/email-validation`, `c/member-details-view`

**Example Acceptance Criteria**:
- [ ] Member ID auto-generated on creation (format: M### incrementing)
- [ ] Search finds members by name, ID, or email
- [ ] Status filter shows "Active" and "Inactive" only
- [ ] Cannot register member with duplicate email
- [ ] Email validation rejects invalid formats
- [ ] Edit form pre-populates with current data
- [ ] Membership date field disabled in edit mode
- [ ] Cannot deactivate members with active loans (warning shown)
- [ ] Member details shows active loan count with list
- [ ] Member details shows total borrowed and borrowing history
- [ ] Pagination works (navigate pages, show 10 per page)
- [ ] Status badge shows "active" (green) or "inactive" (gray)
- [ ] No console errors on any interaction

---

## Team D: Borrow & Return Workflows

**Primary Components**: BorrowReturn page, IssueLoan, ReturnLoan, ActiveLoans, OverdueLoans, LoanHistory

**Files to Manage**:
- `src/pages/BorrowReturn.jsx` - Tab container page
- `src/features/loans/IssueLoan.jsx` - 3-step issue workflow
- `src/features/loans/ReturnLoan.jsx` - Return active loans
- `src/features/loans/ActiveLoans.jsx` - View current loans table
- `src/features/loans/OverdueLoans.jsx` - View overdue loans
- `src/features/loans/LoanHistory.jsx` - View returned loans

**Key Responsibilities**:
- Issue book workflow: member → book → confirm
- Return book workflow: find loan → confirm return
- Validate borrowing rules (active member, under 3 loans, available book, no duplicates)
- Track overdue loans (due + 1 day < today)
- Calculate loan duration (in days)
- Display issue/due/return dates
- Tab navigation between loan operations

**Example Branch**: `d/issue-loan-workflow`, `d/return-loan-validation`, `d/overdue-detection`

**Example Acceptance Criteria**:
- [ ] IssueLoan step 1: Member search shows status and loan count
- [ ] IssueLoan step 2: Book search shows available copies
- [ ] IssueLoan step 3: Preview shows correct issue/due/return dates (due = issue + 14 days)
- [ ] Issue prevented if member inactive (validation message shown)
- [ ] Issue prevented if member already has book on active loan (message shown)
- [ ] Issue prevented if member has 3 active loans (message shown)
- [ ] Issue prevented if book not available (all copies out, message shown)
- [ ] ReturnLoan search finds active loans by member/book/loan ID
- [ ] Overdue badge shows "red" with days overdue count (e.g., "5 days")
- [ ] Active loans table sorted by issue date (newest first)
- [ ] Overdue loans table sorted by days overdue (most overdue first)
- [ ] Loan history shows returned loans with duration calculation
- [ ] Dates format consistently (YYYY-MM-DD)
- [ ] Tab switching doesn't lose data
- [ ] No console errors on workflow

---

## Team E: Reports & Analytics

**Primary Components**: Reports page with charts, filters, export

**Files to Manage**:
- `src/pages/Reports.jsx` - Main reports page with filters, charts, metrics, export

**Key Responsibilities**:
- Date range filtering (startDate, endDate inputs)
- Display metrics cards (issued, returned, active, unique books)
- Render trend chart (weekly borrowing)
- Render category pie chart (borrowing by category)
- Show top 5 most borrowed books
- Display filtered transactions table
- CSV export with proper escaping (prevent formula injection)
- All filters affect all visualizations consistently

**Example Branch**: `e/report-csv-export`, `e/trend-chart`, `e/category-analytics`

**Example Acceptance Criteria**:
- [ ] Date range inputs accept YYYY-MM-DD format
- [ ] "Reset" button clears dates and returns to default (last 90 days)
- [ ] Metrics cards show accurate counts (sum of transactions in range)
- [ ] Trend chart displays weekly data with line graph
- [ ] Trend chart X-axis shows week labels, Y-axis shows loan count
- [ ] Category pie chart shows all book categories with color legend
- [ ] Colors distinguish all 6+ categories clearly
- [ ] Top 5 books ranked with borrow count (most to least)
- [ ] Transactions table shows member, book, issue, return, status
- [ ] Table filtered to date range selected
- [ ] CSV export includes header row and all transactions
- [ ] CSV escapes quotes/newlines to prevent injection attacks
- [ ] File named with date range (e.g., "booknest_2026-08-01_2026-09-14.csv")
- [ ] Charts and tables update when date range changes
- [ ] No console errors with any filter combination

---

## Team F: Integration, Testing & Documentation

**Primary Components**: Cross-feature integration, testing, docs, GitHub setup

**Files to Manage**:
- `src/utils/libraryUtils.test.js` - Unit tests
- `README.md` - Main project documentation
- `CONTRIBUTING.md` - Team collaboration guide
- `.github/` - GitHub templates and workflows

**Key Responsibilities**:
- Verify all features work together
- Write/maintain unit tests for business logic
- Write integration test scenarios
- Maintain README with setup and feature docs
- Maintain CONTRIBUTING with team guidelines
- Create GitHub issue and PR templates
- Test on multiple browsers/devices
- Document known bugs and workarounds
- Create workflow documentation
- GitHub Actions CI/CD setup (if needed)

**Example Branch**: `f/integration-testing`, `f/github-setup`, `f/documentation-updates`

**Example Acceptance Criteria**:
- [ ] All unit tests pass (`npm test`)
- [ ] Test coverage includes core business logic (at least 80%)
- [ ] Integration test checklist executed (manual testing across features)
- [ ] README documents all features and how to use them
- [ ] CONTRIBUTING explains branch naming, commits, PRs, and data contracts
- [ ] GitHub issue templates guide bug and feature reporting
- [ ] PR template includes checklist items
- [ ] WORKFLOW.md documents key data flows with diagrams
- [ ] No broken links in documentation
- [ ] Documentation updated for any new/changed features
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested on mobile (375px), tablet (768px), desktop (1024px+)
- [ ] No console errors or warnings across all workflows
- [ ] Known limitations documented
- [ ] Setup instructions verified (fresh clone + install + dev)

---

## Data Contracts (Shared Between All Teams)

**All teams must maintain these data structures:**

### Book Object
```javascript
{
  id: string,                    // Unique ID
  title: string,                 // Required
  author: string,                // Required
  isbn: string,                  // Unique
  category: string,              // Required
  shelfLocation: string,         // Required
  totalCopies: number,           // >= 1
  description: string,           // Optional
  archived: boolean,             // Default: false
  createdAt: string              // YYYY-MM-DD
}
```

### Member Object
```javascript
{
  id: string,                    // Format: M###
  name: string,                  // Required
  email: string,                 // Unique
  phone: string,                 // Required
  membershipDate: string,        // YYYY-MM-DD
  status: 'active'|'inactive',   // Default: 'active'
  createdAt: string              // YYYY-MM-DD
}
```

### Loan Object
```javascript
{
  id: string,                    // Unique ID
  bookId: string,                // Reference to Book.id
  memberId: string,              // Reference to Member.id
  issueDate: string,             // YYYY-MM-DD
  dueDate: string,               // YYYY-MM-DD (issue + 14 days)
  returnDate: string|null,       // YYYY-MM-DD or null
  createdAt: string              // YYYY-MM-DD
}
```

### Context Actions
- `ADD_BOOK`, `UPDATE_BOOK`, `ARCHIVE_BOOK`, `SET_BOOKS`
- `ADD_MEMBER`, `UPDATE_MEMBER`, `DEACTIVATE_MEMBER`, `SET_MEMBERS`
- `ADD_LOAN`, `RETURN_LOAN`, `SET_LOANS`
- `SET_LOADING`, `SET_ERROR`, `CLEAR_ERROR`

---

## Getting Help

- Check CONTRIBUTING.md for workflow questions
- Check WORKFLOW.md for data flow diagrams
- Ask in team Slack/Discord channel
- Create a GitHub issue for blockers
- Ask instructor for architectural questions

---

**Remember**: Communicate with other teams about shared components and data models!
