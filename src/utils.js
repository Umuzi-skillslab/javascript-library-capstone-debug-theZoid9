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
        ...[
            new Member("M001", "John Smith", "john@gmail.com", "standard"),
            new Member("M002", "Jane Doe", "jane@gmail.com", "premium"),
            new Member("M003", "Mike Brown", "mike@gmail.com", "standard"),
            new Member("M004", "Sarah Jones", "sarah@gmail.com", "premium")
        ]
    );
  

}

// Pure function
// filter()
export function searchBooks(books, searchValue) {
    return books.filter(book =>
        book.title.toLowerCase().includes(searchValue) ||
        book.author.toLowerCase().includes(searchValue)
    );
}   

// Pure function
// Filter()
export function filterBooksByCategory(books, category){
    if(category == "all"){
        return books;
    }
    return books.filter(book => book.category === category);

}

// Pure function
// reduce() X2
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