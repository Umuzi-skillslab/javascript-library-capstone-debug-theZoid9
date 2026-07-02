// Library UI - DOM Manipulation with Complex Errors
import {findBookByISBN, borrowBook, formatBookInfo } from "../src/library.js";
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
// // fix

// Sections
let borrowSection;
let memberSection;
let statisticsSection;
let catalogueSection;
let catalogueContainer;

// nav Tabs
let catalogueTab;
let membersTab;
let statisticsTab;

// buttons 
let searchInput;
let filterDropdown;
let borrowForm;

// helper function - hides all sections
function hideAllSections() {
    catalogueSection.style.display = "none";
    borrowSection.style.display = "none";
    memberSection.style.display = "none";
    statisticsSection.style.display = "none";
}

// fix
function initializeUI() {
    // Wrong selector syntax // fix
   
    borrowForm = document.getElementById("borrow-form");

    // Buttons
    searchInput = document.getElementById("search");
    filterDropdown = document.getElementById("filter-category");

    catalogueTab = document.getElementById("catalogue-tab");
    membersTab = document.getElementById("members-tab");
    statisticsTab = document.getElementById("statistics-tab");


    // Sections
    catalogueSection = document.getElementById("catalogue-section");
    borrowSection = document.getElementById("borrow-section");
    memberSection = document.getElementById("member-section");
    statisticsSection = document.getElementById("statistics-section");

    // Nested sections
    catalogueContainer = document.getElementById("catalogue-list");
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
// fix
function loadCatalogue() {
    renderBookCatalogue(books);
}
// fix
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


     // Catalogue button
    catalogueTab.addEventListener("click", function () {
        hideAllSections();

        catalogueSection.style.display = "block";
        borrowSection.style.display = "block"; // Borrow belongs with catalogue
    });

    // Members button
    membersTab.addEventListener("click", function () {
        hideAllSections();

        memberSection.style.display = "block";
        createMemberForm1();
    });

    // Statistics button
    statisticsTab.addEventListener("click", function () {
        hideAllSections();

        statisticsSection.style.display = "block";
    });

     console.log("Setting up listeners");
    // Missing: event delegation for dynamic elements
}

// Complex DOM rendering with errors 
// // fix - template literals 
function renderBookCatalogue(bookList) {
    // Should clear container first // fix
    catalogueContainer.innerHTML = "";

    // Inefficient - should use DocumentFragment or template literals // fix
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < bookList.length; i++) {
        const bookCard = document.createElement("div");
        bookCard.className = "book-card";
        
        // Should use template literals and data attributes // fix
        bookCard.innerHTML = `
            <h3>${bookList[i].title}</h3>
            <p>Author: ${bookList[i].author}</p>
            <p>Available: ${bookList[i].availableCopies}</p>
           
        `;
        
        bookCard.dataset.isbn = bookList[i].isbn;
        // Missing: unique ID or data attribute for book // fix
        // Missing: event listener for book selection   // fix
        fragment.appendChild(bookCard);
       
    }
     catalogueContainer.appendChild(fragment);
}

// Function with event handling errors 
// // fix
function handleBorrowSubmit(event) {
    // Missing: event.preventDefault()  // fix
    console.log("Press borrow button!!")
    console.log(event.target);
    event.preventDefault();
    const memberIdInput = document.getElementById("member-id");
    const isbnInput = document.getElementById("isbn");
    
    const memberId = memberIdInput.value;
    const isbn = isbnInput.value;

    if (!memberId || !isbn) {
        console.log("!!!NOTHING4")
        alert("Please fill in all fields.");
        
        return;
    }
    // Missing: input validation
    // Missing: error handling
    
    try {
        const success = borrowBook(memberId, isbn);

        if (success) {
            alert("Book borrowed successfully.");
            event.target.reset(); // Clear the form
        } else {
            console.log("!!!else hit")
            alert("Borrowing failed. Check the member ID or ISBN.");
        }
    } catch (error) {
        console.log("!!!NOTHING")
        alert(error.message);
    }
    
    // Missing: form reset
}

// Function missing event delegation
//  // fix
function handleBookClick(event) {
    console.log("Hit book btn")
    console.log(event);
    const detailsContainer = document.getElementById("book-details");
    detailsContainer.classList.remove("hidden");
    // Should use event.target properly // fix
    // Missing: closest() for event delegation // fix 
    const bookCard = event.target.closest(".book-card");

    if (!bookCard) return;
    const bookId = bookCard.dataset.isbn;
    console.log(bookId)
    
    displayBookDetails(bookId);
}

// Search function with errors
// fix - filter()
function handleSearch(event) {
    console.log("handleSearch fired");
    console.log(event.target);
    const searchTerm = event.target.value;
    // Case-sensitive search - should use toLowerCase() // Fix
    // Inefficient filtering  // Fix
    const results = books.filter(books => books.title.toLowerCase().includes(searchTerm))

    renderBookCatalogue(results);
}

// Function with filter errors
// Fix - filter()
function handleFilterChange() {
    console.log("We filtering BABY!!!")
    const selectedCategory = filterDropdown.value;

    // Missing: "all" option handling // fix
    // Should use array filter method // fix
    const filtered = books.filter(books => books.category === selectedCategory || selectedCategory === "all");
    const detailsContainer = document.getElementById("book-details");
    detailsContainer.classList.add("hidden"); // Hide
    renderBookCatalogue(filtered);
}

// Function missing JSON operations
function exportLibraryData1() {
    // Should convert to JSON
    // Missing: error handling
    
    var data = {
        books: books,
        members: members
    };
    
    // Missing: JSON.stringify
    return data;
}

function exportLibraryData() {
    try {
        const data = {
            books: books,
            members: members
        };

        return JSON.stringify(data, null, 2); // Pretty-printed JSON
    } catch (error) {
        console.error("Error exporting library data:", error);
        return null;
    }
}

// Function missing JSON parsing
function importLibraryData(jsonString) {
    // Missing: try-catch for JSON.parse
    // Missing: validation of parsed data
    
    var data = JSON.parse(jsonString);
    
    books = data.books;
    members = data.members;
}

function importLibraryData1(jsonString) {
    try {
        const data = JSON.parse(jsonString);

        // Validate parsed data
        if (!data.books || !data.members) {
            throw new Error("Invalid library data format.");
        }

        if (!Array.isArray(data.books) || !Array.isArray(data.members)) {
            throw new Error("Books and members must be arrays.");
        }

        books = data.books;
        members = data.members;

        console.log("Library data imported successfully.");
    } catch (error) {
        console.error("Error importing library data:", error);
    }
}

// LocalStorage functions with errors
function saveToLocalStorage() {
    // Missing: error handling for localStorage
    // Missing: JSON.stringify
    
    localStorage.setItem("libraryBooks", books);
    localStorage.setItem("libraryMembers", members);
}

function saveToLocalStorage2() {
    try {
        localStorage.setItem("libraryBooks", JSON.stringify(books));
        localStorage.setItem("libraryMembers", JSON.stringify(members));

        console.log("Library data saved.");
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
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

function loadFromLocalStorage1() {
    try {
        const booksData = localStorage.getItem("libraryBooks");
        const membersData = localStorage.getItem("libraryMembers");

        // Check if data exists
        if (booksData !== null) {
            books = JSON.parse(booksData);
        } else {
            books = [];
        }

        if (membersData !== null) {
            members = JSON.parse(membersData);
        } else {
            members = [];
        }

        console.log("Library data loaded.");
    } catch (error) {
        console.error("Error loading from localStorage:", error);

        // Reset if parsing fails
        books = [];
        members = [];
    }
}

// Display function with template issues
//  fix - template literals 
function displayBookDetails(isbn) {
    const book = findBookByISBN(isbn);
    console.log(book)
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

    const formContainer = document.getElementById("member-form");

    const form = document.createElement("form");
    form.id = "create-member-form";

    // --- Name Field ---
    const nameLabel = document.createElement("label");
    nameLabel.textContent = "Full Name";
    nameLabel.setAttribute("for", "name");

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name";
    nameInput.placeholder = "Enter full name";
    nameInput.required = true;

    // --- Email Field ---
    const emailLabel = document.createElement("label");
    emailLabel.textContent = "Email";
    emailLabel.setAttribute("for", "email");

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.id = "email";
    emailInput.placeholder = "Enter email address";
    emailInput.required = true;

    // --- Submit Button ---
    const submitBtn = document.createElement("button");
    submitBtn.type = "submit";
    submitBtn.textContent = "Create Member";

    // --- Assemble form ---
    form.appendChild(nameLabel);
    form.appendChild(nameInput);

    form.appendChild(emailLabel);
    form.appendChild(emailInput);

    form.appendChild(submitBtn);

    // --- Mount to DOM ---
    formContainer.appendChild(form);
}

function createMemberForm1() {
        console.log("createMemberForm called");
    var formContainer = document.getElementById("member-form");

    // Clear any existing form
    formContainer.innerHTML = "";

    // Create form
    var form = document.createElement("form");
    form.id = "member-registration-form";

    // Name label
    var nameLabel = document.createElement("label");
    nameLabel.htmlFor = "name";
    nameLabel.textContent = "Name";

    // Name input
    var nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name";
    nameInput.placeholder = "Enter member name";
    nameInput.required = true;

    // Email label
    var emailLabel = document.createElement("label");
    emailLabel.htmlFor = "email";
    emailLabel.textContent = "Email";

    // Email input
    var emailInput = document.createElement("input");
    emailInput.type = "email";      // Fixed
    emailInput.id = "email";
    emailInput.placeholder = "Enter email address";
    emailInput.required = true;

    // Member ID label
    var idLabel = document.createElement("label");
    idLabel.htmlFor = "member-id";
    idLabel.textContent = "Member ID";

    // Member ID input
    var idInput = document.createElement("input");
    idInput.type = "text";
    idInput.id = "member-id";
    idInput.placeholder = "Enter member ID";
    idInput.required = true;

    // Submit button
    var submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Add Member";

    // Add everything to the form
    form.appendChild(nameLabel);
    form.appendChild(nameInput);

    form.appendChild(emailLabel);
    form.appendChild(emailInput);

    form.appendChild(idLabel);
    form.appendChild(idInput);

    form.appendChild(submitButton);

    // Add form to page
    formContainer.appendChild(form);
}

// Initialize on wrong event
document.addEventListener("DOMContentLoaded", () => {
    initializeUI();
});  // Wrong: should wait for DOMContentLoaded
