// Library UI - DOM Manipulation with Complex Errors
import {findBookByISBN, borrowBook, formatBookInfo, books, members, initializeLibrary } from "../src/library.js";
import { loadFromLocalStorage } from "../src/storage.js";


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
    
    loadFromLocalStorage();
    if (books.length === 0) {
        initializeLibrary();
    }
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
       console.log(document.getElementById("book-details"));
    document.getElementById("book-details").classList.add("hidden");
    renderBookCatalogue(filtered);
 
}

// Display function with template issues
//  fix - template literals 
function displayBookDetails(isbn) {
    const book = findBookByISBN(isbn);
     document.getElementById("book-details").classList.remove("hidden");
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
// fix
function updateStatisticsDisplay() {
    // Wrong selector methods
    const totalBooksEl = document.querySelector(".total-books");
    const totalMembersEl = document.querySelector(".total-members");
    
    // Missing: null checks
    // Should use textContent instead of innerHTML for text
    if (totalBooksEl) {
        totalBooksEl.textContent = books.length;
    }

    if (totalMembersEl) {
        totalMembersEl.textContent = members.length;
    }
    // Missing: update other statistics
}

// Dynamic form generation with errors
// fix
function createMemberForm1() {
        console.log("createMemberForm called");
    const formContainer = document.getElementById("member-form");

    // Clear any existing form
    formContainer.innerHTML = "";

    // Create form
    const form = document.createElement("form");
    form.id = "member-registration-form";

    // Name label
    const nameLabel = document.createElement("label");
    nameLabel.htmlFor = "name";
    nameLabel.textContent = "Name";

    // Name input
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "name";
    nameInput.placeholder = "Enter member name";
    nameInput.required = true;

    // Email label
    const emailLabel = document.createElement("label");
    emailLabel.htmlFor = "email";
    emailLabel.textContent = "Email";

    // Email input
    const emailInput = document.createElement("input");
    emailInput.type = "email";      // Fixed
    emailInput.id = "email";
    emailInput.placeholder = "Enter email address";
    emailInput.required = true;

    // Member ID label
    const idLabel = document.createElement("label");
    idLabel.htmlFor = "member-id";
    idLabel.textContent = "Member ID";

    // Member ID input
    const idInput = document.createElement("input");
    idInput.type = "text";
    idInput.id = "member-id";
    idInput.placeholder = "Enter member ID";
    idInput.required = true;

    // Submit button
    const submitButton = document.createElement("button");
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
    form.addEventListener("submit", handleMemberSubmit);
}

// helper function
function handleMemberSubmit(event) {
    event.preventDefault();

    const member = {
        id: document.getElementById("member-id").value,
        name: document.getElementById("name").value,
        email: document.getElementById("email").value
    };

    members.push(member);

    localStorage.setItem(
        "libraryMembers",
        JSON.stringify(members)
    );

    console.log("Member saved:", member);

    event.target.reset();
}
    
// Initialize on wrong event
document.addEventListener("DOMContentLoaded", () => {
    initializeUI();
});  // Wrong: should wait for DOMContentLoaded
