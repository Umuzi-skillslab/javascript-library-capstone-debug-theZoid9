// Library UI - DOM Manipulation with Complex Errors

const books = [
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

// Missing: proper initialization with DOMContentLoaded
let catalogueContainer;
let searchInput;
let filterDropdown;

function initializeUI() {
    // Wrong selector syntax // fix
    catalogueContainer = document.getElementById("catalogue-list");
    searchInput = document.getElementById("search");
    filterDropdown = document.getElementById("filter-category");
    
    // Missing: null checks // fix
    if (!catalogueContainer) {
        console.error("Catalogue container not found"); 
        return;
    }

    if (!searchInput) {
        console.error("Search input not found");
        return;
    }

    if (!filterDropdown) {
        console.error("Filter dropdown not found");
        return;
    }

    
    setupEventListeners();
    loadCatalogue();
}

function loadCatalogue() {
    renderBookCatalogue(books);
}

function setupEventListeners() {
    // Missing: search input event listener // fix
    
    // Wrong event type // fix
    if (searchInput) {
        searchInput.addEventListener("input", handleSearch);
    }

    if (filterDropdown) {
        filterDropdown.addEventListener("change", handleFilterChange);
    }
    
    // Missing: form submission prevention
    const borrowForm = document.getElementById("borrow-form");

    if (borrowForm) {
        borrowForm.addEventListener("submit", handleBorrowSubmit);
    }

    if (catalogueContainer) {
        catalogueContainer.addEventListener("click", handleBookClick);
    }
    
    // Missing: event delegation for dynamic elements
}

// Complex DOM rendering with errors // fix 
function renderBookCatalogue(bookList) {
    // Should clear container first // fix
    catalogueContainer.innerHTML = "";

    // Inefficient - should use DocumentFragment or template literals
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < bookList.length; i++) {
        const bookCard = document.createElement("div");
        bookCard.className = "book-card";
        
        // Should use template literals and data attributes
        bookCard.innerHTML = `
            <h3>${bookList[i].title}</h3>
            <p>Author: ${bookList[i].author}</p>
            <p>Available: ${bookList[i].availableCopies}</p>
        `;
        
        // Missing: unique ID or data attribute for book
        // Missing: event listener for book selection
        fragment.appendChild(bookCard);
       
    }
     catalogueContainer.appendChild(fragment);
}

// Function with event handling errors // fix
function handleBorrowSubmit(event) {
    // Missing: event.preventDefault()
    event.preventDefault();
    var memberIdInput = document.getElementById("member-id");
    var isbnInput = document.getElementById("isbn");
    
    var memberId = memberIdInput.value;
    var isbn = isbnInput.value;
    
    // Missing: input validation
    // Missing: error handling
    
    var success = borrowBook(memberId, isbn);
    
    // Poor user feedback
    if (success) {
        alert("Book borrowed successfully");
    }
    
    // Missing: form reset
}

// Function missing event delegation // fix
function handleBookClick(event) {
    // Should use event.target properly
    // Missing: closest() for event delegation
    const bookCard = event.target.closest(".book-card");
    if (!bookCard) return;
    const bookId = bookCard.dataset.isbn;
    
    displayBookDetails(bookId);
}

// Search function with errors
function handleSearch(event) {
    var searchTerm = event.target.value;
    
    // Case-sensitive search - should use toLowerCase()
    // Inefficient filtering
    var results = [];
    for (var i = 0; i < books.length; i++) {
        if (books[i].title.includes(searchTerm)) {
            results.push(books[i]);
        }
    }
    
    renderBookCatalogue(results);
}

// Function with filter errors
function handleFilterChange() {
    const selectedCategory = filterDropdown.value;
    
    // Missing: "all" option handling
    // Should use array filter method
    
    let filtered = [];
    for (let i = 0; i < books.length; i++) {
        if (books[i].category === selectedCategory) {  // Wrong operator
            filtered.push(books[i]);
        }
    }
    
    renderBookCatalogue(filtered);
}

// Function missing JSON operations
function exportLibraryData() {
    // Should convert to JSON
    // Missing: error handling
    
    var data = {
        books: books,
        members: members
    };
    
    // Missing: JSON.stringify
    return data;
}

// Function missing JSON parsing
function importLibraryData(jsonString) {
    // Missing: try-catch for JSON.parse
    // Missing: validation of parsed data
    
    var data = JSON.parse(jsonString);
    
    books = data.books;
    members = data.members;
}

// LocalStorage functions with errors
function saveToLocalStorage() {
    // Missing: error handling for localStorage
    // Missing: JSON.stringify
    
    localStorage.setItem("libraryBooks", books);
    localStorage.setItem("libraryMembers", members);
}

function loadFromLocalStorage() {
    // Missing: null check
    // Missing: JSON.parse
    // Missing: error handling
    
    var booksData = localStorage.getItem("libraryBooks");
    var membersData = localStorage.getItem("libraryMembers");
    
    books = booksData;
    members = membersData;
}

// Display function with template issues // fix 
function displayBookDetails(isbn) {
    const book = findBookByISBN(isbn);

    if (!book) {
        console.error("Book not found for ISBN:", isbn);
        return;
    }

    const detailsContainer = document.getElementById("book-details");

    if (!detailsContainer) {
        console.error("Details container not found");
        return;
    }

    const html = `
        <div class="book-details">
            <h2>${book.title}</h2>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>ISBN:</strong> ${book.isbn}</p>
            <p><strong>Year:</strong> ${book.year}</p>
        </div>
    `;

    detailsContainer.innerHTML = html;
}

// Statistics display with errors
function updateStatisticsDisplay() {
    // Wrong selector methods
    var totalBooksEl = document.querySelector(".total-books");
    var totalMembersEl = document.querySelector(".total-members");
    
    // Missing: null checks
    // Should use textContent instead of innerHTML for text
    
    totalBooksEl.innerHTML = books.length;
    totalMembersEl.innerHTML = members.length;
    
    // Missing: update other statistics
}

// Dynamic form generation with errors
function createMemberForm() {
    var formContainer = document.getElementById("member-form");
    
    // Inefficient DOM manipulation
    var form = document.createElement("form");
    
    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name";
    // Missing: label, placeholder, required attribute
    
    var emailInput = document.createElement("input");
    emailInput.type = "text";  // Should be "email"
    emailInput.id = "email";
    
    // Missing: other form fields
    
    form.appendChild(nameInput);
    form.appendChild(emailInput);
    
    formContainer.appendChild(form);
}

// Initialize on wrong event
document.addEventListener("DOMContentLoaded", () => {
    initializeUI();
});  // Wrong: should wait for DOMContentLoaded
