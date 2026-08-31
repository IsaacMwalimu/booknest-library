# Contributing to BookNest

Thank you for contributing to BookNest! This document outlines the workflow and guidelines for the classroom team project.

## Team Structure

1. **Dashboard & Shared Layout** (Team A)
2. **Books** (Team B)
3. **Members** (Team C)
4. **Borrow & Return** (Team D)
5. **Reports** (Team E)
6. **Integration & Testing** (Team F)

## Branch Naming Convention

Use clear, descriptive branch names following this format:

```
{team-letter}/{feature-name}
```

**Examples:**
- `a/dashboard-statistics`
- `b/book-archive-feature`
- `c/member-deactivation`
- `d/return-loan-workflow`
- `e/report-csv-export`
- `f/integration-testing`

**Avoid:**
- `feature123` (too vague)
- `fix-bug` (unclear)
- `new-stuff` (meaningless)

## Commit Message Format

Use clear, atomic commits. Format:

```
[Team Letter] Action: Brief description (present tense)

Optional detailed explanation of the change and why it was made.
```

**Examples:**
```
[A] Feat: Add dashboard statistics cards

Add components to display total books, copies, availability,
active loans, overdue count, and active members.

[B] Fix: Prevent duplicate ISBN entries in book form

Added validation to check for existing ISBNs before saving.

[C] Refactor: Simplify member search logic

Extract search predicate to utility function for reusability.
```

**Guidelines:**
- Use imperative mood: "Add" not "Added"
- One logical change per commit
- Keep commits small and reviewable
- Reference issues if applicable: "Fixes #42"

## Pull Request Process

### Before Creating a PR

1. **Update main branch:**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run checks locally:**
   ```bash
   npm run lint
   npm test
   npm run build
   ```

3. **Test your feature thoroughly** in the browser

### Creating the PR

Use the provided PR template:

```markdown
## Description
Brief summary of what this PR does

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactor

## Changes Made
- Item 1
- Item 2
- Item 3

## Testing
How to test this feature:
1. Navigate to [page]
2. Perform [action]
3. Expect [result]

## Screenshots (if UI change)
[Add screenshots if relevant]

## Checklist
- [ ] Code follows style guide
- [ ] No console errors or warnings
- [ ] Tests pass (if applicable)
- [ ] Build succeeds
- [ ] Documentation updated
- [ ] No breaking changes
```

### Code Review

**Reviewers should check:**
- Does the code work as intended?
- Is the code readable and maintainable?
- Are edge cases handled?
- Is validation present?
- Are there console errors?
- Does it break other features?

**Reviewer approval:**
- At least one other team member must approve
- Keep discussions constructive and focused on code
- Use specific line comments for clarity

**Making requested changes:**
- Commit with: `[Team] Review: Address feedback from PR#123`
- Push again (don't force push to preserve history)
- Request re-review

### Merging

Once approved:
1. Ensure no conflicts with main
2. Use "Squash and merge" for cleaner history (optional)
3. Delete the branch after merging

## Shared Data Contracts

**Important:** Coordinate these data models to prevent breaking changes.

### Book Model
```javascript
{
  id: string,                    // Unique ID (auto-generated)
  title: string,                 // Required, non-empty
  author: string,                // Required, non-empty
  isbn: string,                  // Required, unique, format: XXX-X-XXXXXX-XX-X
  category: string,              // Required, predefined list
  shelfLocation: string,         // Required, format: FIC-001 or NFC-001
  totalCopies: number,           // Required, >= 1
  description: string,           // Optional, max 500 chars
  archived: boolean,             // Default: false
  createdAt: string (YYYY-MM-DD) // Auto-set on creation
}
```

### Member Model
```javascript
{
  id: string,                    // Auto-generated M001, M002, ...
  name: string,                  // Required, non-empty
  email: string,                 // Required, unique, valid email
  phone: string,                 // Required, non-empty
  membershipDate: string (YYYY-MM-DD), // Required
  status: 'active' | 'inactive', // Default: 'active'
  createdAt: string (YYYY-MM-DD) // Auto-set on creation
}
```

### Loan Model
```javascript
{
  id: string,                    // Unique ID (auto-generated)
  bookId: string,                // Reference to Book.id, required
  memberId: string,              // Reference to Member.id, required
  issueDate: string (YYYY-MM-DD),// Date book was issued, required
  dueDate: string (YYYY-MM-DD),  // Date book is due, required (issue + 14 days)
  returnDate: string | null (YYYY-MM-DD), // Null if not returned, required
  createdAt: string (YYYY-MM-DD) // Auto-set on creation
}
```

**Context API Actions:**
```javascript
// Books
{ type: 'ADD_BOOK', payload: book }
{ type: 'UPDATE_BOOK', payload: book }
{ type: 'ARCHIVE_BOOK', payload: bookId }
{ type: 'SET_BOOKS', payload: [books] }

// Members
{ type: 'ADD_MEMBER', payload: member }
{ type: 'UPDATE_MEMBER', payload: member }
{ type: 'DEACTIVATE_MEMBER', payload: memberId }
{ type: 'SET_MEMBERS', payload: [members] }

// Loans
{ type: 'ADD_LOAN', payload: loan }
{ type: 'RETURN_LOAN', payload: { loanId, returnDate } }
{ type: 'SET_LOANS', payload: [loans] }
```

**All times use localStorage (browser time), no timezone conversion.**

## File Structure Guidelines

- **Components**: Always functional, use hooks
- **Props**: Use destructuring, proptypes optional but helpful
- **Naming**: `PascalCase` for components, `camelCase` for functions
- **Imports**: Group by external, internal, relative
- **Exports**: Use `export default` for pages, named exports for components
- **Comments**: Use JSDoc for complex logic

## Testing Standards

For bug fixes and new features, include unit tests:

```javascript
describe('FeatureName', () => {
  it('should do X when Y happens', () => {
    // Arrange
    const input = ...;
    
    // Act
    const result = function(input);
    
    // Assert
    expect(result).toBe(expected);
  });
});
```

Run tests before pushing:
```bash
npm test
```

## Conflict Resolution

**If merge conflicts occur:**

1. Pull the latest main:
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. Resolve conflicts in your editor
   - Keep imports organized
   - Test thoroughly after resolving

3. Complete rebase:
   ```bash
   git add .
   git rebase --continue
   git push origin your-branch --force-with-lease
   ```

4. Communicate with conflicting team to understand changes

## Code Review Checklist

- [ ] Code is readable and self-documenting
- [ ] No `console.log()` statements (or only meaningful ones)
- [ ] No commented-out code
- [ ] Props/functions are properly named
- [ ] Validation is present for user input
- [ ] Error states are handled
- [ ] Empty states are shown
- [ ] Mobile responsiveness checked
- [ ] Accessibility considered (labels, focus states)
- [ ] No performance issues (excessive renders, memory leaks)

## Example Workflow for a Feature

**Team B: Add Book Archiving**

```bash
# 1. Create branch
git checkout main
git pull origin main
git checkout -b b/book-archive-feature

# 2. Make changes, commit regularly
git add src/pages/Books.jsx
git commit -m "[B] Feat: Add archive button to books table"

git add src/features/books/ArchiveDialog.jsx
git commit -m "[B] Feat: Create archive confirmation dialog"

# 3. Test locally
npm run dev
# Manual testing in browser...
npm run build  # Verify production build

# 4. Push and create PR
git push origin b/book-archive-feature
# Go to GitHub, create PR with template

# 5. Wait for review, address feedback
git add src/features/books/BookForm.jsx
git commit -m "[B] Review: Update archive validation logic"
git push origin b/book-archive-feature

# 6. After approval, merge
# (Done via GitHub - delete branch after)

# 7. Clean up locally
git checkout main
git pull origin main
git branch -d b/book-archive-feature
```

## Communication

- **Slack/Discord**: Quick questions, daily updates
- **GitHub Issues**: Bug reports, feature requests, tracking
- **Pull Request**: Detailed discussion about code changes
- **Weekly sync**: Team stand-ups on progress and blockers

## Best Practices

1. **Test before pushing**
   ```bash
   npm run lint && npm test && npm run build
   ```

2. **Pull frequently** to stay in sync
   ```bash
   git pull origin main
   ```

3. **Review your own PR first** before requesting review

4. **Be responsive** to code review comments

5. **Ask for help early** if blocked

6. **Document decisions** in PR description

7. **Keep commits atomic** - one idea per commit

8. **Use meaningful PR descriptions** - reviewers need context

## Questions?

- Check existing issues/PRs for similar questions
- Ask in team Slack channel
- Ask instructor or lead developer

---

Happy coding! 🚀
