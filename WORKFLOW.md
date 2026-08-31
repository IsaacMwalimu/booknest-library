# BookNest Application Workflow

This document describes the key workflows and data flow in BookNest using a Mermaid diagram.

## System Architecture

```mermaid
graph TB
    subgraph UI["UI Layer"]
        Dashboard[Dashboard]
        Books[Books Page]
        Members[Members Page]
        BorrowReturn[Borrow & Return]
        Reports[Reports]
    end

    subgraph State["State Management"]
        Context[LibraryContext<br/>useReducer]
        Reducer["Reducer<br/>(Actions)"]
    end

    subgraph Services["Services Layer"]
        Storage["Storage Service<br/>(localStorage)"]
        Utils["Library Utils<br/>(Business Logic)"]
    end

    subgraph Data["Data Storage"]
        Books_DB[(Books)]
        Members_DB[(Members)]
        Loans_DB[(Loans)]
    end

    UI -->|useLibrary| Context
    Context -->|dispatch| Reducer
    Reducer -->|add/update| Storage
    Reducer -->|queries| Utils
    Storage -->|read/write| Books_DB
    Storage -->|read/write| Members_DB
    Storage -->|read/write| Loans_DB
    Utils -->|calculate| Dashboard
    Utils -->|validate| BorrowReturn
```

## Workflow: Issue a Book

```mermaid
sequenceDiagram
    Actor Member as Member
    participant UI as IssueLoan UI
    participant Context as LibraryContext
    participant Utils as Library Utils
    participant Storage as Storage Service

    Member->>UI: Search and select member
    UI->>Context: Query members
    Context->>Storage: Get all members
    Storage-->>Context: Return members
    Context-->>UI: Display members

    Member->>UI: Select member
    UI->>Context: Query member's active loans
    Context->>Utils: getMemberActiveLoans()
    Utils-->>Context: Return count
    Context-->>UI: Show loan count (X/3)

    Member->>UI: Search and select book
    UI->>Context: Query available books
    Context->>Storage: Get all books
    Storage-->>Context: Return books
    Context->>Utils: Calculate available copies
    Utils-->>Context: Return available count
    Context-->>UI: Display books with availability

    Member->>UI: Select book
    UI->>Context: Validate borrowing eligibility
    Context->>Utils: canMemberBorrow()
    Context->>Utils: isBookAvailable()
    Context->>Utils: hasMemberBorrowedBook()
    Utils-->>Context: Validation result
    
    alt Validation Success
        Context-->>UI: Enable Confirm button
        Member->>UI: Click Confirm Issue
        UI->>Context: Create loan object
        Context->>Reducer: ADD_LOAN action
        Reducer->>Storage: Save loan to localStorage
        Storage-->>Reducer: Loan saved
        Reducer-->>Context: Update state
        Context-->>UI: Show success message
        UI-->>Member: Issue complete
    else Validation Failed
        Context-->>UI: Show validation error
        UI-->>Member: Cannot issue (reason shown)
    end
```

## Workflow: Return a Book

```mermaid
sequenceDiagram
    Actor Librarian as Librarian
    participant UI as ReturnLoan UI
    participant Context as LibraryContext
    participant Utils as Library Utils
    participant Storage as Storage Service

    Librarian->>UI: Search active loans
    UI->>Context: Query active loans
    Context->>Storage: Get all loans (not returned)
    Storage-->>Context: Return active loans
    Context->>Utils: Filter and sort
    Utils-->>Context: Return sorted loans
    Context-->>UI: Display active loans

    Librarian->>UI: Select a loan
    UI->>UI: Show loan details
    UI->>Utils: isLoanOverdue()
    Utils-->>UI: Overdue status
    UI-->>Librarian: Display loan info + overdue alert

    Librarian->>UI: Click Confirm Return
    UI->>Context: Create return action
    Context->>Reducer: RETURN_LOAN action (set returnDate)
    Reducer->>Storage: Update loan in localStorage
    Storage-->>Reducer: Loan updated
    Reducer-->>Context: Update state
    Context->>Dashboard: Trigger stats update
    Context-->>UI: Show success
    UI-->>Librarian: Return complete
```

## Workflow: Track Overdue Loans

```mermaid
graph LR
    subgraph Check["Overdue Detection"]
        Today["Today's Date"]
        DueDate["Loan Due Date"]
        Compare["Due + 1 day < Today?"]
    end

    subgraph Result["Result"]
        Overdue["Mark as OVERDUE"]
        NotOverdue["Still ACTIVE"]
    end

    Today -->|Compare| Compare
    DueDate -->|Compare| Compare
    Compare -->|YES| Overdue
    Compare -->|NO| NotOverdue
    Overdue -->|Display in| OverduePage["Overdue Tab"]
    Overdue -->|Alert in| Dashboard["Dashboard"]
```

## Workflow: Generate Reports

```mermaid
graph TD
    User["User selects<br/>date range"]
    User -->|startDate to endDate| Filter["Filter loans<br/>by date"]
    Filter -->|Issued in period| Issued["Loans Issued"]
    Filter -->|Returned in period| Returned["Loans Returned"]
    Filter -->|Across all time| Active["Current Active"]
    
    Issued -->|Calculate| Calc["Calculate Statistics"]
    Returned -->|Calculate| Calc
    
    Calc --> Stats["Stats:<br/>Total issued, returned,<br/>unique books, active"]
    Stats -->|Group by date| Chart1["Trend Chart<br/>Weekly"]
    Stats -->|Group by category| Chart2["Category Pie Chart"]
    Stats -->|Top 5| Popular["Most Borrowed"]
    
    Chart1 -->|Render| Reports["Reports Page"]
    Chart2 -->|Render| Reports
    Popular -->|Render| Reports
    
    Reports -->|Export| CSV["CSV File<br/>All transactions"]
    Reports -->|Print| Print["Print View"]
```

## Data Relationships

```mermaid
graph LR
    Book["📚 Book<br/>id, title, author<br/>isbn, category<br/>totalCopies, archived"]
    Member["👤 Member<br/>id, name, email<br/>phone, status"]
    Loan["🔗 Loan<br/>id, bookId, memberId<br/>issueDate, dueDate<br/>returnDate"]
    
    Loan -->|references| Book
    Loan -->|references| Member
    Book -.->|many| Loan
    Member -.->|many| Loan
```

## State Update Flow

```mermaid
graph TD
    subgraph User["User Action"]
        Click["Click button"]
    end

    subgraph Component["Component"]
        Handler["Event handler"]
        Dispatch["dispatch({type, payload})"]
    end

    subgraph Reducer["Reducer (Context)"]
        Switch["switch(action.type)"]
        Update["Update state"]
        Save["Call storageService.save()"]
    end

    subgraph Storage["Storage Service"]
        LocalStorage["localStorage.setItem()"]
    end

    subgraph Rerender["Re-render"]
        NewState["Component receives<br/>new state via context"]
        Display["Display updated data"]
    end

    Click --> Handler
    Handler --> Dispatch
    Dispatch --> Switch
    Switch --> Update
    Update --> Save
    Save --> LocalStorage
    LocalStorage --> NewState
    NewState --> Display
```

## Example: Adding a Book

Step-by-step execution:

```
1. User fills BookForm
   - Validates inputs (non-empty, unique ISBN)
   - Checks existing books for ISBN conflicts
   
2. User clicks "Add Book"
   - Component calls addBook() from useLibrary()
   
3. addBook() dispatches ADD_BOOK action
   - Payload: { id, title, author, isbn, ... }
   
4. Reducer handles ADD_BOOK:
   - Creates new books array: [...books, newBook]
   - Calls storageService.saveBooks(newBooks)
   
5. Storage Service:
   - localStorage.setItem('booknest_books', JSON.stringify(newBooks))
   
6. Reducer updates context state:
   - state.books = newBooks
   
7. All subscribed components re-render:
   - Books.jsx gets new books list
   - Dashboard re-calculates statistics
   - Reports data updates
   
8. UI shows success message
   - Modal closes
   - Books table refreshes
```

## Borrowing Rules Implementation

```mermaid
graph TD
    Attempt["Member attempts<br/>to borrow"]
    
    Check1["Member<br/>active?"]
    Check1 -->|No| Fail1["❌ Inactive member<br/>cannot borrow"]
    Check1 -->|Yes| Check2
    
    Check2["Member has<br/>< 3 loans?"]
    Check2 -->|No| Fail2["❌ Loan limit<br/>reached"]
    Check2 -->|Yes| Check3
    
    Check3["Book<br/>available?"]
    Check3 -->|No| Fail3["❌ All copies<br/>checked out"]
    Check3 -->|Yes| Check4
    
    Check4["No duplicate<br/>active loan?"]
    Check4 -->|No| Fail4["❌ Member already<br/>has this book"]
    Check4 -->|Yes| Check5
    
    Check5["Book not<br/>archived?"]
    Check5 -->|No| Fail5["❌ Book is<br/>archived"]
    Check5 -->|Yes| Success
    
    Success["✅ Issue loan<br/>Generate dueDate<br/>Save to localStorage"]
    
    Fail1 --> End["Cannot issue"]
    Fail2 --> End
    Fail3 --> End
    Fail4 --> End
    Fail5 --> End
    Success --> Done["Loan created"]
```

## Date Handling

All dates are in `YYYY-MM-DD` format, using browser's local timezone:

```javascript
issueDate: "2026-08-31"      // Today
dueDate: "2026-09-14"        // 14 days later
returnDate: null             // Not yet returned
isOverdue: true              // If today > dueDate + 1 day
```

**No timezone conversion is performed** - all times are browser-local for simplicity in classroom setting.

---

*For more details, see README.md and CONTRIBUTING.md*
