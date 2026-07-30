// Library Management System - Starter Code with Complex Errors

// Global state management (scoping issues) // fix
export let books = [];

export let members = [];

const LATE_FEE_PER_DAY = 0.5;
const MAX_BOOKS_PER_MEMBER = 5;

// Book class with multiple issues // fix

class Book {
  constructor(isbn, title, author, year, copies, category,
    cover = null,
    pdf = null) {
      this.type = "physical";
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.year = year;
    this.availableCopies = copies;
    this.totalCopies = copies;
    this.category = category;

    this.cover = cover;
    this.pdf = pdf;
    this.checkedOut = [];
  }


  isAvailable() {
    return this.availableCopies > 0;
  }

 
  getInfo() {
    return `${this.title} by ${this.author} (${this.year}) - ISBN: ${this.isbn}`;
  }

  checkOut(memberId) {

    if (
      memberId === undefined ||
      memberId === null ||
      (typeof memberId !== "string" && typeof memberId !== "number")
    ) {
      throw new Error("memberId must be a string or number");
    }

    if (this.availableCopies <= 0) {
      throw new Error("No available copies to check out");
    }

    if (this.checkedOut.includes(memberId)) {
      throw new Error("Member already checked out this book");
    }

    const borrowDate = new Date();

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() - 1 ); // test due date here

    this.checkedOut.push({
      memberId,
      borrowDate,
      dueDate
    });
    this.availableCopies--;
    return true;
  }
}

// Digital book class with inheritance problems //

class DigitalBook extends Book {
  constructor(isbn, title, author, year, copies, category, fileSize, format,
    cover = null,
    pdf = null) {
  
    super(isbn, title, author, year, copies, category,cover,
      pdf);
      this.type = "digital";
    this.fileSize = fileSize;
    this.format = format;
    this.cover = cover;
    this.pdf = pdf;
    this.downloads = 0;
    this.downloadHistory = [];
  }

  download(memberId) {
    
    if (
      memberId === undefined ||
      memberId === null ||
      (typeof memberId !== "string" && typeof memberId !== "number")
    ) {
      throw new Error("memberId must be a string or number");
    }

    this.downloads++;
    this.downloadHistory.push({
      memberId,
      time: new Date().toISOString(),
    });

    return true;
  }
}

// Member class with errors // fix

class Member {
  constructor(id, name, email, membershipType) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.membershipType = membershipType;
    this.borrowedBooks = [];
    this.joinDate = new Date();
    // Missing: joinDate property // fix
  }

  // Missing: method to calculate membership duration // fix

  getMembershipDuration() {
    const today = new Date();
    const diff = today - this.joinDate;

    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  // Missing: method using destructuring //  fix
  // destructuring
  getMemberInfo() {
    const { id, name, email, membershipType } = this;

    return {
      id,
      name,
      email,
      membershipType,
    };
  }

  canBorrow() {
    return this.borrowedBooks.length < MAX_BOOKS_PER_MEMBER;
  }
}

// Premium member with inheritance issues
class PremiumMember extends Member {
  constructor(id, name, email) {
    super(id, name, email, "premium");
    // Missing: additional premium benefits properties // fix
    this.maxBooks = 10;
    this.priorityReservations = true;
    this.lateFeeDiscount = 0.25;
  }

  // Should override canBorrow to allow more books
  canBorrow() {
    return this.borrowedBooks.length < this.maxBooks;
  }
}

// Complex function with nested loops and errors
// fix - Redo Maybe
function findOverdueBooks() {
  const today = new Date();

  return books.reduce((overdue, book) => {
    const overdueRecords = book.checkedOut
      .filter(record => today >= new Date(record.dueDate))
      .map(record => ({
        memberId: record.memberId,
        isbn: book.isbn,
        title: book.title,
        daysLate: Math.floor(
          (today - new Date(record.dueDate)) / (1000 * 60 * 60 * 24)
        ),
      }));

    return overdue.concat(overdueRecords);
  }, []);
}

// Function with while loop error
// fix
function processReturnQueue(queue) {
  if (!Array.isArray(queue)) {
    return;
  }

  let index = 0;

  while (index < queue.length) {
    const item = queue[index];

    if (!item || typeof item !== "object") {
      index++;
      continue;
    }

    if (typeof item.isbn !== "string" || typeof item.memberId !== "string") {
      index++;
      continue;
    }

    const book = findBookByISBN(item.isbn);

    const member = findMemberById(item.memberId);

    if (book && member) {
      book.availableCopies++;

      book.checkedOut = book.checkedOut.filter(
        (checkout) => checkout.memberId !== item.memberId,
      );

      member.borrowedBooks = member.borrowedBooks.filter(
        (isbn) => isbn !== item.isbn,
      );
    }

    index++;
  }
}

// Recursive function with multiple errors
function searchBooksByCategory(bookList, category, index = 0) {
  if (!Array.isArray(bookList)) {
    return [];
  }

  if (index >= bookList.length) {
    return [];
  }

  const matches =
    bookList[index].category === category ? [bookList[index]] : [];

  return matches.concat(searchBooksByCategory(bookList, category, index + 1));
}

// Function missing array methods
// Fix - filter
function getBooksByAuthor(authorName) {
  return books.filter((book) => book.author === authorName);
}

// Function that should use reduce
// fix - reduce
function calculateTotalLateFees(memberRecord) {
  return memberRecord.overdueBooks.reduce((total, book) => {
    return total + book.daysLate * LATE_FEE_PER_DAY;
  }, 0);
}

// fix - spread operator
function combineBookCollections(fiction, nonFiction, reference) {
  if (
    !Array.isArray(fiction) ||
    !Array.isArray(nonFiction) ||
    !Array.isArray(reference)
    ) {
      return [];
    }
  return [...fiction, ...nonFiction, ...reference];
}

// fix - spread operator
function addMultipleBooks(...newBooks) {
  const validBooks = newBooks.filter(
    (book) =>
      book &&
      typeof book === "object" &&
      typeof book.isbn === "string"
  );

  books.push(...validBooks);
}

// Function missing destructuring
// fix - destructuring
function updateMemberInfo(member, updates) {
  if (!member || typeof member !== "object") {
    return null;
  }

  if (!updates || typeof updates !== "object") {
    return member;
  }

  const { name, email, membershipType } = updates;

  if (name) member.name = name;
  if (email) member.email = email;
  if (membershipType) {
    member.membershipType = membershipType;
  }

  return member;
}

// using findMemberById, findBookByISBN function to push book into borrow book array for member using memberId 

function borrowBook(memberId, isbn) {
  try {
    if (!memberId || !isbn) {
      throw new Error("Member ID and ISBN are required");
    }
    if (typeof memberId !== "string" || typeof isbn !== "string") {
      throw new Error("Member ID and ISBN must be strings");
    }

    const member = findMemberById(memberId);
    const book = findBookByISBN(isbn);
    // No check if member or book exists  // fix

    if (!member) {
      throw new Error("Member not found");
    }

    if (!book) {
      throw new Error("Book not found");
    }

    if (book.type === "digital") {
    throw new Error(
        "Digital books cannot be borrowed. Please download them instead."
    );
}

    if (!book.isAvailable()) {
      throw new Error("No copies of this book are currently available.");
    }

    if (!member.canBorrow()) {
      throw new Error("Member has reached the borrowing limit.");
    }

    if (member.borrowedBooks.includes(book.isbn)) {
      throw new Error("Member has already borrowed this book.");
    }

    book.checkOut(member.id);

    if (!Array.isArray(member.borrowedBooks)) {
      member.borrowedBooks = [];
    }

    member.borrowedBooks.push( 
        isbn
    );

    return true;

  } catch (error) {
    throw error;
  }
}

// fix - Find()
// Pure
function findMemberById(id) {
  return members.find((member) => member.id === id);
}

// Fix - find()
// pure
function findBookByISBN(isbn) {
  if (isbn === undefined || isbn === null) return null;
  if (typeof isbn !== "string") return null;

  return books.find((books) => books.isbn === isbn);
}

// Library Statistics
// Statistics object with missing methods
const LibraryStats = {
  totalBooks: 0,
  totalMembers: 0,
  totalBorrowings: 0,

  updateStats() {
    this.totalBooks = books.length;

    this.totalMembers = members.length;

    this.totalBorrowings = books.reduce(
      (total, book) => total + book.checkedOut.length,
      0,
    );
  },

  getMostPopularBook() {
    if (books.length === 0) {
      return null;
    }

    return books.reduce((popular, current) =>
      current.checkedOut.length > popular.checkedOut.length ? current : popular,
    );
  },

  getStatistics() {
    this.updateStats();

    return {
      totalBooks: this.totalBooks,
      totalMembers: this.totalMembers,
      totalBorrowings: this.totalBorrowings,
    };
  },
};

function formatBookInfo(book) {
  if (!book) {
    return "<p>No book selected.</p>";
  }

  const isDigital = book.type === "digital";

  return `
    <div class="book-info">

      <img
        class="book-cover-large"
        src="${book.cover || "covers/default-book.png"}"
        alt="${book.title} cover"
      >

      <div class="book-details">

        <h2>${book.title}</h2>

        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Published:</strong> ${book.year}</p>
        <p><strong>ISBN:</strong> ${book.isbn}</p>
        <p><strong>Category:</strong> ${book.category}</p>

        <p><strong>Type:</strong> ${
          isDigital ? "Digital Book" : "Physical Book"
        }</p>

        ${
          isDigital
            ? `
              <p><strong>Format:</strong> ${book.format}</p>
              <p><strong>File Size:</strong> ${book.fileSize}</p>
              <p><strong>Total Downloads:</strong> ${book.downloads}</p>

              <label for="download-member">
                <strong>Select Member:</strong>
              </label>

              <select id="download-member">
                <option value="">Choose a member...</option>
              </select>

              <button
                class="download-btn"
                data-isbn="${book.isbn}">
                ⬇ Download PDF
              </button>
            `
            : `
              <p><strong>Available Copies:</strong>
                ${book.availableCopies} / ${book.totalCopies}
              </p>

              <p><strong>Currently Borrowed:</strong>
                ${book.checkedOut.length}
              </p>
            `
        }

      </div>

    </div>
  `;
}

function calculateFineAmount(daysLate) {
  if (daysLate === undefined || daysLate === null) {
    return 0;
  }

  if (typeof daysLate !== "number" || Number.isNaN(daysLate)) {
    return 0;
  }

  return Number((daysLate * LATE_FEE_PER_DAY).toFixed(2));
}

function deleteMember(id) {
  const index = members.findIndex((member) => member.id === id);

  if (index === -1) {
    return false;
  }

  members.splice(index, 1);

  return true;
}

export {
  Book,
  DigitalBook,
  Member,
  PremiumMember,
  borrowBook,
  findBookByISBN,
  findMemberById,
  searchBooksByCategory,
  getBooksByAuthor,
  combineBookCollections,
  addMultipleBooks,
  updateMemberInfo,
  calculateFineAmount,
  calculateTotalLateFees,
  processReturnQueue,
  findOverdueBooks,
  formatBookInfo,
  LibraryStats,
  deleteMember
};
