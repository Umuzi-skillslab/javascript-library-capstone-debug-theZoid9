// Library Management System - Starter Code with Complex Errors

// Global state management (scoping issues) // fix
export let books = [
    {
        isbn: "9780134685991",
        title: "Effective JavaScript",
        author: "David Herman",
        year: 2012,
        availableCopies:2,
        category: "reference"
    },
    {
        isbn: "9781491950296",
        title: "Learning React",
        author: "Alex Banks",
        year: 2020,
        availableCopies:1,
        category: "non-fiction"
    }
];

//let books = [];  
export let  members = [{ "id": "M001", "name": "John Smith", "email": "john@gmail.com" }];  

const LATE_FEE_PER_DAY = 0.50;
const MAX_BOOKS_PER_MEMBER = 5;  

// Book class with multiple issues // fix

class Book {
    constructor(isbn, title, author, year, copies) {
        this.isbn = isbn;
        this.title = title;
        this.author = author;
        this.year = year;
    // Missing: availableCopies and totalCopies properties // fix
        this.availableCopies = copies;
        this.totalCopies = copies;
        this.checkedOut = [];
    }
    
    // Missing: method to check availability // fix
    isAvailable(){
        return this.availableCopies > 0;
    }

    // Missing: method to get book info using template literals // fix
    getInfo(){
        return `${this.title} by ${this.author} (${this.year}) - ISBN: ${this.isbn}`;
    }
    
    checkOut(memberId) {
    // No validation for available copies // fix
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

        this.checkedOut.push(memberId);
        this.availableCopies--;
        return true;
    }
}

// Digital book class with inheritance problems // 

class DigitalBook extends Book {
    constructor(isbn, title, author, year, copies, fileSize, format) {
        // Missing: super() call with correct parameters // fix
        super(isbn, title, author, year, copies);
        this.fileSize = fileSize;
        this.format = format;
        this.downloads = 0;
        this.downloadHistory = [];
    }
    
    download(memberId) {
        // Should override differently than physical checkout
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
            time:new Date().toISOString()
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

    getMemberInfo() {
        const { id, name, email, membershipType } = this;

        return {
            id,
            name,
            email,
            membershipType
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


// Find Overdue Books
// Searches every book in the library for
// checkout records that are overdue.
//
// Parameters:
// daysOverdue - Number of days a book
// must be overdue.
//
// Returns:
// An array containing overdue checkout
// records.
// ========================================

// Complex function with nested loops and errors
function findOverdueBooks(daysOverdue) {

    const overdue = [];

    if (typeof daysOverdue !== "number" || daysOverdue < 0) {
        return overdue;
    }

    for (const book of books) {

        if (!Array.isArray(book.checkedOut)) {
            continue;
        }

        for (const record of book.checkedOut) {

            if (
                record &&
                record.daysLate !== undefined &&
                record.daysLate >= daysOverdue
            ) {
                overdue.push({
                    ...record,
                    isbn: book.isbn,
                    title: book.title
                });
            }

        }

    }

    return overdue;

}
    

// Function with while loop error
function processReturnQueue(queue) {
    let index = 0;
    
    // Infinite loop potential
    while (index < queue.length) {
        const item = queue[index];
        
        // Process item
        console.log(`Processing return: ${item}`);
        
        // Missing: index increment
        index++
    }
}

// Returns:
// Array of matching books.
// ========================================

// Recursive function with multiple errors
function searchBooksByCategory(
    bookList,
    category,
    index = 0
) {

    if (!Array.isArray(bookList)) {
        return [];
    }

    if (index >= bookList.length) {
        return [];
    }

    const matches =
        bookList[index].category === category
            ? [bookList[index]]
            : [];

    return matches.concat(
        searchBooksByCategory(
            bookList,
            category,
            index + 1
        )
    );

}

// Function missing array methods
// Fix - filter
function getBooksByAuthor(authorName) {
  
    console.log("hit get author!!")
    const result = books.filter( book => book.author === authorName);
    return result;
}

// Function that should use reduce
// fix - reduce 
function calculateTotalLateFees(memberRecord) {
    return memberRecord.overdueBooks.reduce((total, book) => {
        return total + book.daysLate * LATE_FEE_PER_DAY;
    }, 0);
}

// Function missing spread operator
function combineBookCollections(
    fiction,
    nonFiction,
    reference
) {

    return [
        ...fiction,
        ...nonFiction,
        ...reference
    ];

}

// Function missing rest parameters
function addMultipleBooks(...newBooks) {
    // Should use rest parameters to accept unlimited books
    books.push(...newBooks);
}

// Function missing destructuring
function updateMemberInfo(member, updates) {

    const {
        name,
        email,
        membershipType
    } = updates;

    if (name) member.name = name;
    if (email) member.email = email;
    if (membershipType) {
        member.membershipType = membershipType;
    }

    return member;

}

// Function with no error handling 
// fix - try and catch + type of checks
function borrowBook(memberId, isbn) {
    // Missing: try-catch block
    // Missing: validation for undefined/null
    // Missing: typeof checks
    try {
        if (!memberId || !isbn){
            throw new Error("Member ID and ISBN are required");
        }
        if (typeof memberId !== "string" || typeof isbn !== "string") {
            throw new Error("Member ID and ISBN must be strings");
        }

        const member = findMemberById(memberId);
        const book = findBookByISBN(isbn);
        // No check if member or book exists  // fix
        if(!member){
            throw new Error("Member not found");
        }

        if(!book){
            throw new Error("Book not found");
        }

        if(!member.canBorrow()){
            return false;
        }

        book.checkOut(memberId);

        if(!Array.isArray(member.borrowedBooks)){
            member.borrowBooks = [];
        }

        member.borrowBooks.push(isbn);

        return true;

    }catch(error){
        console.error("borrowBook error:", error.message);
        throw error;
    }

   

}

// Helper functions with errors
function findMemberById(id) {

    return members.find(
        member => member.id === id
    ) || null;

}

// Fix - find()
function findBookByISBN(isbn) {
    console.log("hit get book isbn!")

    if (isbn === undefined || isbn === null) return null;
    if (typeof isbn !== 'string') return null;

    return books.find(books => books.isbn === isbn);
}

// Library Statistics
// Maintains statistics for the library.
//
// Stores:
//
// • Total books
// • Total members
// • Total borrowings
//
// Provides helper methods.
// ========================================

// Statistics object with missing methods
const LibraryStats = {

    totalBooks: 0,
    totalMembers: 0,
    totalBorrowings: 0,

    updateStats() {

        this.totalBooks = books.length;
        this.totalMembers = members.length;

    },

    getMostPopularBook() {

        if (books.length === 0) {
            return null;
        }

        return books.reduce(

            (popular, current) =>

                current.checkedOut.length >
                popular.checkedOut.length

                    ? current

                    : popular

        );

    },

    getStatistics() {

        this.updateStats();

        return {

            totalBooks: this.totalBooks,
            totalMembers: this.totalMembers,
            totalBorrowings: this.totalBorrowings

        };

    }

};


// Function with string manipulation errors // fix
function formatBookInfo(book) {
    // Should use template literals

    if (!book) {

        return "<p>No book selected.</p>";

    }
    // add validation 
    return `
            <h3>${book.title}</h3>
            <p>Author: ${book.author}</p>
            <p>Year: ${book.year}</p>

            `;
    // Missing: proper string methods (trim, toUpperCase, etc.)
    
   
}

// Function with number/type issues
function calculateFineAmount(daysLate) {

    if (
        daysLate === undefined ||
        daysLate === null
    ) {
        return 0;
    }

    if (
        typeof daysLate !== "number" ||
        Number.isNaN(daysLate)
    ) {
        return 0;
    }

    return Number(
        (daysLate * LATE_FEE_PER_DAY)
        .toFixed(2)
    );

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

    LibraryStats

};

// Missing: proper data structure for ISBN lookups (Map/Set)   <=== why is this here?




const member1 = new Member(
    1,
    "John Smith",
    "john@gmail.com",
    "standard"
);

const premium1 = new PremiumMember(
    2,
    "Sarah Khan",
    "sarah@gmail.com"
);

const normalBook = new Book(
    '978-0-123',
    'Test Book',
    'Author Name', 
    2020,
    5
);
const book = new DigitalBook(
    "9780134685991",
    "Effective JavaScript",
    "David Herman",
    2012,
    2,
    5,
    "PDF"
);

