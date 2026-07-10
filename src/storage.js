import {
    books,
    members,
    Book,
    DigitalBook,
    Member,
    PremiumMember
} from "./library.js";

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

        console.log("Library data saved.");

    } catch (error) {

        console.error(
            "Error saving to localStorage:",
            error
        );

    }

}

export function loadFromLocalStorage() {

    try {

        const booksData = JSON.parse(
            localStorage.getItem("libraryBooks")
        ) || [];

        const membersData = JSON.parse(
            localStorage.getItem("libraryMembers")
        ) || [];

        if (
            booksData.length === 0 &&
            membersData.length === 0
        ) {
            return false;
        }

        // Prevent duplicates
        books.length = 0;
        members.length = 0;

        // Restore Books
        booksData.forEach(data => {

            let book;

            if (data.fileSize !== undefined) {

                book = new DigitalBook(
                    data.isbn,
                    data.title,
                    data.author,
                    data.year,
                    data.totalCopies,
                    data.fileSize,
                    data.format
                );

            } else {

                book = new Book(
                    data.isbn,
                    data.title,
                    data.author,
                    data.year,
                    data.totalCopies,
                    data.category
                );

            }

            book.availableCopies = data.availableCopies;
            book.checkedOut = data.checkedOut || [];

            books.push(book);

        });

        // Restore Members
        membersData.forEach(data => {

            let member;

            if (data.membershipType === "premium") {

                member = new PremiumMember(
                    data.id,
                    data.name,
                    data.email
                );

            } else {

                member = new Member(
                    data.id,
                    data.name,
                    data.email,
                    data.membershipType
                );

            }

            member.borrowedBooks =
                data.borrowedBooks || [];

            member.joinDate =
                new Date(data.joinDate);

            members.push(member);

        });

        console.log("Library data loaded.");

        return true;

    } catch (error) {

        console.error(
            "Error loading from localStorage:",
            error
        );

        books.length = 0;
        members.length = 0;

        return false;

    }

}

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

    } catch (error) {

        console.error(
            "Error exporting library data:",
            error
        );

        return null;

    }

}

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

        localStorage.setItem(
            "libraryBooks",
            JSON.stringify(data.books)
        );

        localStorage.setItem(
            "libraryMembers",
            JSON.stringify(data.members)
        );

        loadFromLocalStorage();

        console.log(
            "Library imported successfully."
        );

    } catch (error) {

        console.error(
            "Import failed:",
            error
        );

    }

}