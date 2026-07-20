# Library Management System

## System Overview

The Library Management System is a JavaScript ES6 application that allows users to manage books, members, borrowing, returns, and library statistics through an interactive browser interface. The project follows an object-oriented architecture using classes, modules, and pure utility functions to separate business logic from UI rendering.

The application supports:

- Book catalogue management
- Digital and physical books
- Member registration and editing
- Borrowing and returning books
- Search and category filtering
- Library statistics dashboard
- LocalStorage persistence
- Automated Jest testing with high code coverage

---

# Critical Errors Found

| Severity | Error |
|----------|-------|
| Critical | Duplicate books loaded from LocalStorage |
| Critical | Missing validation for borrowed books |
| Critical | Member deletion left borrowed books orphaned |
| Critical | Missing null checks on DOM elements |
| Critical | Borrowed copies not updating correctly |
| Critical | Missing return queue validation |
| High | Undefined variables in utility functions |
| High | Missing error handling in storage import |
| High | Invalid JSON crashed application |
| High | Missing duplicate member validation |
| High | Statistics not updating after borrow |
| High | Event listeners attached multiple times |
| High | Search rendered duplicate catalogue entries |
| High | Missing member existence validation |
| Medium | Empty search not restoring catalogue |
| Medium | Category filtering ignored "All" option |
| Medium | LocalStorage import duplicated objects |
| Medium | Edit form retained stale member data |
| Medium | Missing overdue rendering validation |
| Low | Console errors during invalid storage operations |

**Total Critical Issues Fixed:** 20

---

# Fixes Implemented

## Storage

- Added LocalStorage save/load support
- Prevented duplicate object loading
- Added JSON parsing protection
- Added import/export validation
- Added graceful error recovery

## Library Logic

- Improved borrow and return validation
- Fixed member deletion workflow
- Prevented invalid borrow operations
- Improved statistics calculations
- Added proper error handling

## User Interface

- Refactored rendering functions
- Improved event listener organization
- Added reusable message rendering
- Improved catalogue updates
- Added edit member workflow
- Improved navigation rendering

## Testing

- Added comprehensive Jest test suite
- Tested UI rendering
- Tested storage functionality
- Tested borrowing workflow
- Tested member management
- Tested statistics calculations
- Added error-path testing

---

# Modern ES6+ Features

The project uses modern JavaScript throughout including:

- ES Modules (`import` / `export`)
- Classes and inheritance
- Template literals
- Arrow functions
- Destructuring
- Spread operator
- Default parameters
- Array methods (`map`, `filter`, `reduce`, `find`, `findIndex`)
- Optional error handling with `try...catch`
- `const` and `let`
- Object literals
- Pure functions

---

# Architecture Improvements

The project was refactored into modular components.

### Classes

- Book
- DigitalBook
- Member
- PremiumMember

### Modules

- library.js
- ui.js
- storage.js
- utils.js

### Improvements

- Separation of business logic from UI
- Pure utility functions
- Modular architecture
- Improved maintainability
- Better testability
- Reduced duplicated code
- Improved event handling

---

# Installation

Clone the repository

```bash
git clone https://github.com/Umuzi-skillslab/javascript-library-capstone-debug-theZoid9
```

Install dependencies

```bash
npm install
```

---

# Running the Application

Start the application using your preferred local web server.

Examples:

```bash
npx serve
```

or

```bash
live-server
```

Open the browser and navigate to:

```
http://localhost:3000
```

(or the address provided by your local server)

---

# Running Tests

Run all tests

```bash
npm test
```

Run coverage

```bash
npm test -- --coverage
```

---

# Key Functions

### renderBookCatalogue()

Displays the current book catalogue and updates the UI.

### handleBorrowSubmit()

Validates borrowing requests and updates members and books.

### handleReturnSubmit()

Processes returned books and restores available copies.

### updateStatisticsDisplay()

Calculates and renders current library statistics.

### saveToLocalStorage()

Persists books and members.

### loadFromLocalStorage()

Restores application data while preventing duplicates.

### importLibraryData()

Imports exported JSON data.

### exportLibraryData()

Exports the current library state.

---

# Screenshots

Include the following screenshots in the `/screenshots` folder.

## 1. Application Running

![Library System Screenshot](images/screenshot.png)


## 2. Browser Console

```
screenshots/console.png
```

Show no JavaScript errors.

## 3. Jest Tests

```
screenshots/tests.png
```

Show all tests passing (15+ tests).

## 4. Coverage Report

```
screenshots/coverage.png
```

Show coverage greater than 80%.

## 5. Features

```
screenshots/search.png
screenshots/borrow.png
screenshots/statistics.png
```

Demonstrate search, borrowing, and statistics functionality.

---

# Reflection

The most challenging aspect of the project was debugging interconnected application logic across multiple modules. Issues such as duplicated LocalStorage data, borrow and return synchronization, event listener duplication, and UI rendering required careful tracing to identify the root causes.

A structured debugging approach was used throughout the project by reproducing failures, isolating affected modules, writing targeted Jest tests, and validating fixes through repeated test execution. Refactoring into smaller reusable functions also made debugging significantly easier.

This project reinforced the importance of modular architecture, defensive programming, automated testing, and incremental development. Achieving high test coverage helped expose hidden edge cases while increasing confidence that new changes did not introduce regressions. Overall, the project strengthened practical skills in JavaScript, DOM manipulation, object-oriented programming, testing with Jest, and maintaining a clean, maintainable codebase.
