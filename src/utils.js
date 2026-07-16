import {
  books,
  members,
  Member,
  Book,
  DigitalBook,
  findBookByISBN,
  findMemberById,
} from "../src/library.js";

// Pre Loaded data
export function initializeLibrary() {
  if (books.length > 0) return;

  books.push(
    new DigitalBook(
      "9780134685991",
      "PARALLEL WORLDS",
      "Michio Kaku",
      2012,
      2,
      "fiction",
      "24 MB",     
      "PDF",                
      "covers/pworlds.png",  
      "books/pworlds.pdf"    
    ),
    new Book(
      "9781491950296",
      "Learning React",
      "Alex Banks",
      2020,
      10,
      "non-fiction",
    ),
  );

  members.push(
    ...[
      new Member("M001", "John Smith", "john@gmail.com", "standard"),
      new Member("M002", "Jane Doe", "jane@gmail.com", "premium"),
      new Member("M003", "Mike Brown", "mike@gmail.com", "standard"),
      new Member("M004", "Sarah Jones", "sarah@gmail.com", "premium"),
    ],
  );
}

// Pure function
// filter()
export function searchBooks(books, searchValue) {
  return books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchValue) ||
      book.author.toLowerCase().includes(searchValue),
  );
}

// Pure function
// Filter()
export function filterBooksByCategory(books, category) {
  if (category == "all") {
    return books;
  }
  return books.filter((book) => book.category === category);
}

// Pure function
// reduce() X2
export function getLibraryStatistics(books, members) {
  return {
    totalBooks: books.length,
    totalMembers: members.length,
    availableBooks: books.reduce((sum, book) => sum + book.availableCopies, 0),
    borrowedBooks: books.reduce((sum, book) => sum + book.checkedOut.length, 0),
  };
}

// helper for handleReturnSubmit
export function processReturnQueue(queue) {
  let index = 0;

  while (index < queue.length) {
    const item = queue[index];

    const book = findBookByISBN(item.isbn);
    const member = findMemberById(item.memberId);

    if (!book) {
      throw new Error("Book not found.");
    }

    if (!member) {
      throw new Error("Member not found.");
    }

    const checkoutIndex = book.checkedOut.findIndex(
      (checkout) => checkout.memberId === item.memberId,
    );

    if (checkoutIndex === -1) {
      throw new Error("This member did not borrow this book.");
    }

    book.availableCopies++;

    book.checkedOut.splice(checkoutIndex, 1);

    member.borrowedBooks = member.borrowedBooks.filter(
      (borrowedIsbn) => borrowedIsbn !== item.isbn,
    );

    index++;
  }
}
