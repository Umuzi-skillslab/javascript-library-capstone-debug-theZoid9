import { books, members, Member, Book } from "../src/library.js";



// Pre Loaded data
export function initializeLibrary() {

    if (books.length > 0) return;

    books.push(
        new Book(
            "9780134685991",
            "Effective JavaScript",
            "David Herman",
            2012,
            6,
            "reference"
        ),
        new Book(
            "9781491950296",
            "Learning React",
            "Alex Banks",
            2020,
            1,
            "non-fiction"
        )
    );

    members.push(
        new Member(
            "M001",
            "John Smith",
            "john@gmail.com",
            "standard"
        )
    );

}

// Pure Helper functions

// fix - filter()
export function searchBooks(books, searchValue) {
    return books.filter(book =>
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm)
    );
}   


export function filterBooksByCategory(books, category){
    if(category == "all"){
        return books;
    }

    return books.filter(book => book.category === category);

}


export function getLibraryStatistics(books, members) {
    return {
        totalBooks: books.length,
        totalMembers: members.length,
        availableBooks: books.reduce(
            (sum, book) => sum + book.availableCopies,
            0
        ),
        borrowedBooks: books.reduce(
            (sum, book) => sum + book.checkedOut.length,
            0
        )
    };
}