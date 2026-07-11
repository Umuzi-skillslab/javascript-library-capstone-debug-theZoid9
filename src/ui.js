// Library UI - DOM Manipulation with Complex Errors

import {
    findBookByISBN,
    borrowBook,
    formatBookInfo,
    books,
    members,
    Member,
    Book,
     findMemberById,
     updateMemberInfo,
     findOverdueBooks,
     deleteMember
} from "./library.js";

import {
    loadFromLocalStorage,
    saveToLocalStorage
} from "./storage.js";

import {initializeLibrary, searchBooks, filterBooksByCategory, getLibraryStatistics} from "./utils.js"

// Global DOM References

// Sections
let borrowSection;
let memberSection;
let statisticsSection;
let catalogueSection;
let catalogueContainer;
let returnSection;

// Navigation Tabs
let catalogueTab;
let membersTab;
let statisticsTab;

// Form Controls
let searchInput;
let filterDropdown;
let borrowForm;

// Members
let memberList;

// fix - dom
function initializeUI() {

    // Forms
    borrowForm = document.getElementById("borrow-form");

    // Inputs
    searchInput = document.getElementById("search");
    filterDropdown = document.getElementById("filter-category");

    // Navigation
    catalogueTab = document.getElementById("catalogue-tab");
    membersTab = document.getElementById("members-tab");
    statisticsTab = document.getElementById("statistics-tab");

    // Sections
    catalogueSection = document.getElementById("catalogue-section");
    borrowSection = document.getElementById("borrow-section");
    memberSection = document.getElementById("member-section");
    statisticsSection = document.getElementById("statistics-section");

    // Catalogue Container
    catalogueContainer = document.getElementById("catalogue-list");

    // Members

    memberList = document.getElementById("member-list");

    // return section
   returnSection = document.getElementById("return-section");
    // Validation

    if (!catalogueContainer) {

        console.error("Catalogue container not found.");

        return;

    }

    if (!searchInput) {

        console.error("Search input not found.");

        return;

    }

    if (!filterDropdown) {
        console.error("Filter dropdown not found.");
        return;

    }

    const loaded = loadFromLocalStorage();
   
    if (!loaded) {

        initializeLibrary();
        saveToLocalStorage();
    }


    loadCatalogue();
    renderMemberList();
   
    createReturnForm();
    updateStatisticsDisplay();
    setupEventListeners();
    
}

// fix - dom
function loadCatalogue() {
  renderBookCatalogue(books);
}

// fix - dom
function setupEventListeners() {
    // Search
    if (searchInput) {
            searchInput.addEventListener("input", handleSearch
        );
    }
    // Category Filter
    if (filterDropdown) {
        filterDropdown.addEventListener("change", handleFilterChange
        );
    }
    // Borrow Form
    if (borrowForm) {
        borrowForm.addEventListener("submit", handleBorrowSubmit
        );
    }
    // Event Delegation
    if (catalogueContainer) {
        catalogueContainer.addEventListener("click", handleBookClick
        );
    }

    // Navigation Tabs

    if (catalogueTab) {
        catalogueTab.addEventListener(
            "click",
            () => {
                hideAllSections();
                catalogueSection.style.display = "block";
                borrowSection.style.display = "block";
                returnSection.style.display = "block";
            }
        );
    }

    if( memberList){
        memberList.addEventListener("click", handleMemberClick);
    }

    if (membersTab) {
        membersTab.addEventListener(
            "click",
            () => {
                hideAllSections();
                memberSection.style.display = "block";
                createMemberForm1();
            }
        );
    }

    if (statisticsTab) {
        statisticsTab.addEventListener(
            "click",
            () => {
                hideAllSections();
                statisticsSection.style.display = "block";
                updateStatisticsDisplay();
                 renderOverdueBooks();
            }
        );
    }


    console.log("Event listeners loaded.");



}

// fix - template literals
function renderBookCatalogue(bookList) {

    // Clear previous books
    catalogueContainer.innerHTML = "";

    // Display a message if there are no books
    if (!Array.isArray(bookList) || bookList.length === 0) {

        catalogueContainer.innerHTML = `
            <p class="empty-message">
                No books found.
            </p>
        `;
        return;
    }

    // Improves performance by updating the DOM only once
    const fragment = document.createDocumentFragment();

    // Create one card for each book
    for (const book of bookList) {

        const bookCard = document.createElement("div");

        bookCard.className = "book-card";

        // Store the ISBN for event delegation
        bookCard.dataset.isbn = book.isbn;

        // Display book information
        bookCard.innerHTML = `

            <h3>${book.title}</h3>

            <p><strong>Author:</strong> ${book.author}</p>

            <p><strong>Category:</strong> ${book.category}</p>

            <p><strong>Year:</strong> ${book.year}</p>

            <p><strong>Available:</strong> ${book.availableCopies}</p>

        `;

        fragment.appendChild(bookCard);

    }

    catalogueContainer.appendChild(fragment);

}

//dom
// fix
function handleBookClick(event) {

    // Find the nearest book card
    const bookCard = event.target.closest(".book-card");

    if (!bookCard) {
        return;
    }

    // Read the stored ISBN
    const isbn = bookCard.dataset.isbn;

    displayBookDetails(isbn);

}

// Display function with template issues
//dom
// fix - template literals
function displayBookDetails(isbn) {

    const detailsContainer =
        document.getElementById("book-details");

    if (!detailsContainer) {
        console.error("Book details container not found.");
        return;
    }

    const book = findBookByISBN(isbn);

    if (!book) {
        detailsContainer.innerHTML = `
            <p>Book not found.</p>
        `;
        return;
    }

    // Show hidden panel
    detailsContainer.classList.remove("hidden");

    // Uses helper function from library.js
    detailsContainer.innerHTML = formatBookInfo(book);

}

// Function with event handling errors
// fix - dom
function handleBorrowSubmit(event) {

    event.preventDefault();

    const memberIdInput = document.getElementById("member-id");
    const isbnInput = document.getElementById("isbn");

    const memberId = memberIdInput.value.trim();
    const isbn = isbnInput.value.trim();

    if (!memberId || !isbn) {
        alert("Please complete all fields.");
        return;
    }

    try {

        const success = borrowBook(memberId, isbn);
        console.log(books);
        if (success) {
            alert("Book borrowed successfully.");
            saveToLocalStorage();
            renderBookCatalogue(books);
            updateStatisticsDisplay();
            event.target.reset();
        }

    } catch (error) {
        alert(error.message);
    }

}

// Search function with errors
// fix - filter() - Event fdunction
function handleSearch(event) {
    const searchValue = event.target.value.trim().toLowerCase();
    const filteredBooks = searchBooks( books, searchValue)
    renderBookCatalogue(filteredBooks);
}

// Function with filter errors
// Fix - filter() - Event function
function handleFilterChange() {
    const details = document.getElementById("book-details");

    if (details) {
        details.classList.add("hidden");
    }

    const filteredBooks =  filterBooksByCategory(books, filterDropdown.value)
    renderBookCatalogue(filteredBooks);

}

// helper function -  Event function
// some()
function handleMemberSubmit(event) {

    event.preventDefault();

     const form = event.target;

        const id = form.querySelector("#member-id").value.trim();
        const name = form.querySelector("#name").value.trim();
        const email = form.querySelector("#email").value.trim();

    if (!id || !name || !email) {
        alert("Please complete all fields.");
        return;
    }

    // Prevent duplicate IDs

    const exists = members.some(member => member.id === id );

    if (exists) {
        alert("Member ID already exists.");
        return;
    }

    const newMember = new Member(
        id,
        name,
        email,
        "standard"
    );

    members.push(newMember);
    saveToLocalStorage();
    renderMemberList();
    updateStatisticsDisplay();
    alert("Member registered successfully.");
    event.target.reset();

}

// Statistics display dataq
// fix - dom  - use Template Literals
function updateStatisticsDisplay() {
    console.log("Updating statistics...");

    const stats = getLibraryStatistics(books, members);

    const totalBooks = document.querySelector(".total-books");
    const totalMembers = document.querySelector(".total-members");
    const availableBooks = document.querySelector(".available-books");
    const borrowedBooks = document.querySelector(".books-borrowed");

    if (totalBooks) {
        totalBooks.textContent = stats.totalBooks;
    }

    if (totalMembers) {
        totalMembers.textContent = stats.totalMembers;
    }

    if (availableBooks) {
        availableBooks.textContent = stats.availableBooks;
    }

    if (borrowedBooks) {
        borrowedBooks.textContent = stats.borrowedBooks;
    }
    console.log("Updating statistics.done!");
}

// Create Member Form
// Dynamic form generation with errors
// fix - use Template Literals
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

// helper function - hides all sections but dom
function hideAllSections() {

    if (catalogueSection)
        catalogueSection.style.display = "none";

    if (borrowSection)
        borrowSection.style.display = "none";

    if (memberSection)
        memberSection.style.display = "none";

    if (statisticsSection)
        statisticsSection.style.display = "none";

    if (returnSection)
        returnSection.style.display = "none";
}


// fix - Template Literals
function renderMemberList() {
    const container = document.getElementById("member-list");

    container.innerHTML = "";
    if (members.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No members found.</p>
            </div>
        `;
        return;
    }
   
    members.forEach(member => {
       
        const card = document.createElement("div");

        card.className = "member-card";

        card.innerHTML = `
            <h3>${member.name}</h3>

            <p>${member.id}</p>

            <p>${member.email}</p>

            <p>${member.membershipType}</p>

            <p>
                Borrowed:
                ${member.borrowedBooks.length}
            </p>

            <button class="edit-member"
                data-id="${member.id}">
                Edit
            </button>

        `;
       
        container.appendChild(card);

    });
}

function handleMemberClick(event) {

    const button = event.target.closest(".edit-member");

    if (!button) {
        return;
    }

    const id = button.dataset.id;
    const form = document.getElementById("edit-member-form");

    showEditMemberForm(id);

}

// fix - Template Literals
function showEditMemberForm(id) {

    const member = findMemberById(id);

    if (!member) {
        alert("Member not found.");
        return;
    }

    const formContainer =
        document.getElementById("member-form");

        formContainer.innerHTML = `
            <h2>Edit Member</h2>

            <p class="form-description">
                Update this member's information below.
            </p>

            <form id="edit-member-form">

                <input
                    id="name"
                    value="${member.name}"
                    required
                >

                <input
                    id="email"
                    value="${member.email}"
                    required
                >

                <select id="membership-type">

                    <option
                        value="standard"
                        ${member.membershipType === "standard" ? "selected" : ""}>
                        Standard
                    </option>

                    <option
                        value="premium"
                        ${member.membershipType === "premium" ? "selected" : ""}>
                        Premium
                    </option>

                </select>

                <div class="form-buttons">

                    <button type="submit">
                        Save Changes
                    </button>

                    <button
                        type="button"
                        id="cancel-edit">
                        Cancel
                    </button>

                    <button
                        type="button"
                        id="delete-member">
                        Delete Member
                    </button>

                </div>

            </form>
        `;

    document
        .getElementById("edit-member-form")
        .addEventListener(
            "submit",
            event => handleEditMemberSubmit(event, id)
        );

    document.getElementById("cancel-edit")
    .addEventListener("click", () => {
        createMemberForm1();
    });

    document.getElementById("delete-member")
        .addEventListener("click", () => {
                event.preventDefault();
                event.stopPropagation();

                console.log("Delete clicked");

             console.log("Delete clicked", member.id);
                deleteMember(member.id);
                saveToLocalStorage(); 
                renderMemberList();
                createMemberForm1();
        });

    const form = document.getElementById("member-form");

    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    document.getElementById("name").focus();
}


// Help funtion for form 
function renderMemberMessage(message, type = "success") {

    const container =
        document.getElementById("member-message");

    container.innerHTML = `
        <div class="member-message ${type}">
            ${message}
        </div>
    `;

}

function handleEditMemberSubmit(event, id) {

    event.preventDefault();

    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const membershipType =
        document.getElementById("membership-type").value;

    const member = findMemberById(id);

    updateMemberInfo(member, {
        name,
        email,
        membershipType
    });

    saveToLocalStorage();

    renderMemberList();
    createMemberForm1();

    alert("Member updated.");

}

// fix - Template Literals
function renderOverdueBooks() {

    const overdue = findOverdueBooks();

    const count =
        document.getElementById("overdue-count");

    const list =
        document.getElementById("overdue-list");

    if (!count || !list) {
        return;
    }

    count.textContent = overdue.length;

    list.innerHTML = "";

    if (overdue.length === 0) {

        list.innerHTML = `
            <p class="empty-message">
                No overdue books
            </p>
        `;

        return;
    }

    overdue.forEach(book => {

            list.innerHTML += `
                <div class="overdue-book">

                    <strong>${book.title}</strong>

                    <p>
                        <span>Member:</span>
                        ${book.memberId}
                    </p>

                    <p>
                        <span>Days Late:</span>
                        ${book.daysLate}
                    </p>

                </div>
            `;

    });

}

// fix - Template Literals
function createReturnForm() {

    const container = document.getElementById("return-section");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <h2>Return Book</h2>

        <form id="return-form">

            <input
                type="text"
                id="return-member-id"
                placeholder="Member ID"
                required
            >

            <input
                type="text"
                id="return-isbn"
                placeholder="ISBN"
                required
            >

            <button type="submit">
                Return Book
            </button>

        </form>
    `;

    document
        .getElementById("return-form")
        .addEventListener(
            "submit",
            handleReturnSubmit
        );

}

function handleReturnSubmit(event) {

    event.preventDefault();

    const memberId = document
        .getElementById("return-member-id")
        .value
        .trim();

    const isbn = document
        .getElementById("return-isbn")
        .value
        .trim();

    if (!memberId || !isbn) {
        alert("Please complete all fields.");
        return;
    }

    try {

        processReturnQueue([
            {
                memberId,
                isbn
            }
        ]);

        saveToLocalStorage();

        renderBookCatalogue(books);
        renderMemberList();
        updateStatisticsDisplay();
        renderOverdueBooks();

        event.target.reset();

        alert("Book returned successfully.");

    } catch (error) {

        alert(error.message);

    }

}


// helper for handleReturnSubmit
function processReturnQueue(queue) {

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
            checkout => checkout.memberId === item.memberId
        );

        if (checkoutIndex === -1) {
            throw new Error("This member did not borrow this book.");
        }

        book.availableCopies++;

        book.checkedOut.splice(checkoutIndex, 1);

        member.borrowedBooks =
            member.borrowedBooks.filter(
                borrowedIsbn => borrowedIsbn !== item.isbn
            );

        index++;

    }

}
// Initialize on DOMContentLoaded
document.addEventListener(

    "DOMContentLoaded", () => { initializeUI();

    }

);