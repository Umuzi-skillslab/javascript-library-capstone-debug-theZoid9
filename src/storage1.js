// ========================================
// Storage Management
//
// Handles saving, loading, importing,
// exporting and clearing library data
// using the browser's localStorage.
//
// This file does NOT manage books or
// members directly. It only stores and
// retrieves the arrays from library.js.
// ========================================

import {
    books,
    members,
    Book,
    Member
} from "./library.js";

// ========================================
// Save Library Data
//
// Converts the books and members arrays
// into JSON strings and saves them in
// localStorage.
//
// Returns:
// Nothing.
// ========================================

export function saveToLocalStorage() {

    try {

        localStorage.setItem(
            "libraryBooks",
            JSON.stringify(books)
        );

        localStorage.setItem(
            "libraryMembers",
            JSON.stringify(members)
        );

        console.log("Library saved successfully.");

    }

    catch (error) {

        console.error(
            "Error saving library:",
            error
        );

    }

}

// ========================================
// Load Library Data
//
// Reads saved data from localStorage and
// restores the books and members arrays.
//
// Existing arrays are cleared first to
// prevent duplicate data.
//
// Returns:
// Nothing.
// ========================================

export function loadFromLocalStorage() {

    try {
        const storedBooks = JSON.parse(
            localStorage.getItem("libraryBooks")
        );

        const storedMembers = JSON.parse(
            localStorage.getItem("libraryMembers")
        );

        // Prevent duplicates      members.length = 0;

        if (Array.isArray(storedBooks)) {

            books.push(

            ...storedBooks.map(book => {

            const newBook = new Book(

                book.isbn,
                book.title,
                book.author,
                book.year,
                book.totalCopies

            );

            newBook.availableCopies = book.availableCopies;
            newBook.checkedOut = book.checkedOut || [];

            return newBook;

        })

    );

        }
  
        if (Array.isArray(storedMembers)) {

            if (Array.isArray(storedMembers)) {

                 members.push(

               ...storedMembers.map(member => {

            const newMember = new Member(
                member.id,
                member.name,
                member.email,
                member.membershipType
            );

            newMember.borrowedBooks =
                member.borrowedBooks || [];

            newMember.joinDate =
                new Date(member.joinDate);

            return newMember;

        })

    );

}

        }

        console.log("Library loaded successfully.");

    }

    catch (error) {

        console.error(
            "Error loading library:",
            error
        );

    }

}

// ========================================
// Export Library Data
//
// Converts the complete library into a
// formatted JSON string.
//
// Useful for backups.
//
// Returns:
// JSON string.
// ========================================

export function exportLibraryData() {

    try {

        return JSON.stringify(

            {

                books,
                members

            },

            null,

            2

        );

    }

    catch (error) {

        console.error(
            "Error exporting library:",
            error
        );

        return "";

    }

}

// ========================================
// Import Library Data
//
// Imports a JSON string containing books
// and members.
//
// Existing data is replaced.
//
// Parameters:
// jsonString
//
// Returns:
// true if successful.
// false otherwise.
// ========================================

export function importLibraryData(jsonString) {
    try {
        const data = JSON.parse(jsonString);

        if (
            !Array.isArray(data.books) ||
            !Array.isArray(data.members)

        ) {
            throw new Error(
                "Invalid library data."
            );
        }

        books.length = 0;
        books.push(...data.books);

        members.length = 0;
        members.push(...data.members);

        saveToLocalStorage();

        console.log(
            "Library imported successfully."
        );

        return true;

    }

    catch (error) {

        console.error(
            "Import failed:",
            error
        );

        return false;

    }

}

// ========================================
// Clear Library Storage
//
// Removes all saved library data from
// localStorage and clears the arrays.
//
// Useful for testing.
//
// Returns:
// Nothing.
// ========================================

export function clearLibraryStorage() {

    localStorage.removeItem("libraryBooks");

    localStorage.removeItem("libraryMembers");

    books.length = 0;

    members.length = 0;

    console.log("Library storage cleared.");

}