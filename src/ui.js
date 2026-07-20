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
  deleteMember,
  calculateFineAmount
} from "./library.js";

import { loadFromLocalStorage, saveToLocalStorage } from "./storage.js";

import {
  initializeLibrary,
  searchBooks,
  filterBooksByCategory,
  getLibraryStatistics,
  processReturnQueue,
} from "./utils.js";

// ======================================================
// GLOBAL DOM REFERENCES
// ======================================================

// Sections
let borrowSection;
let memberSection;
let statisticsSection;
let catalogueSection;
let returnSection;

// Navigation
let catalogueTab;
let membersTab;
let statisticsTab;

// Forms
let borrowForm;
let returnForm;

// Inputs
let searchInput;
let filterDropdown;

// Containers
let catalogueContainer;
let memberList;

// Edit Member
let editMemberForm;
let cancelEditButton;
let deleteMemberButton;
let editingMemberId;

let bookDetailsContainer;

// ======================================================
// INITIALIZATION
// ======================================================
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
  

  borrowSection.style.display = "none";
  returnSection.style.display = "none";


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

function loadCatalogue() {
  // fix later
  const detailsContainer = document.getElementById("book-details");
  detailsContainer.classList.add("hidden")
  renderBookCatalogue(books);
}

// ======================================================
// EVENT LISTENERS
// ======================================================

function setupEventListeners() {
  // Forms
  const borrowForm = document.getElementById("borrow-form");
  const returnForm = document.getElementById("return-form");

  // Inputs
  const searchInput = document.getElementById("search");
  const filterDropdown = document.getElementById("filter-category");

  // Containers
  const catalogueContainer = document.getElementById("catalogue-list");
  const memberList = document.getElementById("member-list");

  // Navigation
  const catalogueTab = document.getElementById("catalogue-tab");
  const membersTab = document.getElementById("members-tab");
  const statisticsTab = document.getElementById("statistics-tab");

  bookDetailsContainer = document.getElementById("book-details");
  // Return form
  returnForm?.addEventListener("submit", handleReturnSubmit);

  // Search
  searchInput?.addEventListener("input", handleSearch);

  // Category filter
  filterDropdown?.addEventListener("change", handleFilterChange);

  // Borrow form
  borrowForm?.addEventListener("submit", (event) => {
    handleBorrowSubmit(event);
    saveToLocalStorage();
  });

  // Catalogue
  catalogueContainer?.addEventListener("click", handleBookClick);

  // Members
  memberList?.addEventListener("click", handleMemberClick);

  // Navigation
  catalogueTab?.addEventListener("click", showCatalogue);
  membersTab?.addEventListener("click", showMembers);
  statisticsTab?.addEventListener("click", showStatistics);


  // dwn
  bookDetailsContainer?.addEventListener("click", handleDownloadClick);
}

function handleDownloadClick(event) {
      const detailsContainer = document.getElementById("book-details");
    const button = event.target.closest(".download-btn");

    if (!button) return;

    const isbn = button.dataset.isbn;

    const memberId = document.getElementById("download-member").value;

    if (!memberId) {
        renderMemberMessage("return-message2", "select a member", "error");
        return;
    }

    const book = books.find(book => book.isbn === isbn);

    if (!book.pdf) {
        return;
    }

    try {
        book.download(memberId);

        saveToLocalStorage();
        renderMemberMessage("return-message2", "Thank you for downloading!");
 
        
        displayBookDetails(book);
        
        renderMemberMessage("return-message2", "Thank you for downloading!");
               setTimeout(() => {
            window.open(book.pdf, "_blank");
        }, 4000);

    } catch (error) {
          renderMemberMessage("return-message2", "select a member", "error");
        return;
    }
}



function setupEditMemberEventListeners() {
  editMemberForm?.addEventListener("submit", handleEditMemberSubmit);

  cancelEditButton?.addEventListener("click", handleCancelEdit);

  deleteMemberButton?.addEventListener("click", handleDeleteMember);
}
// ======================================================
// NAVIGATION
// ======================================================

function showCatalogue() {
  
  hideAllSections();
  const detailsContainer = document.getElementById("book-details");
  detailsContainer?.classList.add("hidden");

  catalogueSection.style.display = "block";
  borrowSection.style.display = "none";
  returnSection.style.display = "none";
}

function showMembers() {
  hideAllSections();

  memberSection.style.display = "block";
  createMemberForm();
  renderMemberList();
}

function showStatistics() {
  hideAllSections();

  statisticsSection.style.display = "block";
  updateStatisticsDisplay();
  renderOverdueBooks();
}

function hideAllSections() {
  if (catalogueSection) catalogueSection.style.display = "none";

  if (borrowSection) borrowSection.style.display = "none";

  if (memberSection) memberSection.style.display = "none";

  if (statisticsSection) statisticsSection.style.display = "none";

  if (returnSection) returnSection.style.display = "none";
}

// ======================================================
// CATALOGUE - All book related function
// ======================================================

// Rendering Books From Utils "I can use a api btw"
function renderBookCatalogue(bookList) {

  const catalogueContainer = document.getElementById("catalogue-list");
    catalogueContainer.innerHTML = "";

  if (!Array.isArray(bookList) || bookList.length === 0) {
    catalogueContainer.innerHTML = `
            <p class="empty-message">
                No books found.
            </p>
        `;
    return;
  }

  const fragment = document.createDocumentFragment();


    for (const book of bookList) {
        const bookCard = document.createElement("div");

        bookCard.className = "book-card";
        bookCard.dataset.isbn = book.isbn;

 
      bookCard.innerHTML = `
        <img
          class="catalogue-cover"
          src="${book.cover || "covers/default-book.png"}"
          alt="${book.title} cover"
        >
      `;

        fragment.appendChild(bookCard);
    }

  catalogueContainer.appendChild(fragment);
}

// Action when clicking book 
function handleBookClick(event) {
  const bookCard = event.target.closest(".book-card");

  if (!bookCard) {
    return;
  }
  const isbn = bookCard.dataset.isbn;

  displayBookDetails(isbn);
}


function populateDownloadMembers() {

  const select = document.getElementById("download-member");
  if (!select) return;

  select.innerHTML = `
    <option value="">Select Member</option>
  `;

  members.forEach(member => {
    select.innerHTML += `
      <option value="${member.memberId}">
        ${member.name}
      </option>
    `;
  });
}

// Displaying book information book using isbn string value to find info
function displayBookDetails(isbn) {
  const detailsContainer = document.getElementById("book-details");

  if (!detailsContainer) {
    console.error("Book details container not found.");
    return;
  }

  const book = findBookByISBN(isbn);

  if (!book) {
    document.getElementById("book-details");
    return;
  }


  const borrowSection = document.getElementById("borrow-section");
  const returnSection = document.getElementById("return-section");

  if (book.type === "digital") {
      borrowSection.style.display = "none";
      returnSection.style.display = "none";
  } else {
      borrowSection.style.display = "block";
      returnSection.style.display = "block";
  }

  // Show hidden panel
  detailsContainer.classList.remove("hidden");

  // Uses helper function from library.js
  detailsContainer.innerHTML = formatBookInfo(book);

  populateDownloadMembers();
  
}

// Search features up top
function handleSearch(event) {
  const searchValue = event.target.value.trim().toLowerCase();
  const filteredBooks = searchBooks(books, searchValue);
  renderBookCatalogue(filteredBooks);
}

function handleFilterChange() {
  const details = document.getElementById("book-details");

  details?.classList.add("hidden");

  borrowSection.style.display = "none";
  returnSection.style.display = "none";

  const filteredBooks = filterBooksByCategory(books, filterDropdown.value);
  renderBookCatalogue(filteredBooks);
}

// ======================================================
// BORROWING
// ======================================================

function handleBorrowSubmit(event) {
  event.preventDefault();

  const memberIdInput = document.getElementById("member-id");
  const isbnInput = document.getElementById("isbn");

  const memberId = memberIdInput.value.trim();
  const isbn = isbnInput.value.trim();
  const book = findBookByISBN(isbn);
  if (!memberId || !isbn) {
    renderMemberMessage(
      "borrow-message",
      "Please complete all fields.",
      "error",
    );
    return;
  }

  try {
    const success = borrowBook(memberId, isbn);

    if (success) {
      saveToLocalStorage();
      loadCatalogue();
      displayBookDetails(isbn);
      updateStatisticsDisplay();
      renderMemberMessage("borrow-message",  `<span class="book-title">${book.title}</span> borrowed successfully.`);
      event.target.reset();
    }
  } catch (error) {
    renderMemberMessage("borrow-message", error.message, "error");
  }
}

// ======================================================
// RETURNS
// ======================================================

// Rendering form for Returning the book (Only Renders for non-digital books)
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
  returnForm = document.getElementById("return-form");
}

// After clicking get member id and isbn from current input  - Lastly render message on screen using renderMemberMessage()
// Use it in ProcessReturnQueue()
/* Other function used:
    saveToLocalStorage();
    displayBookDetails(isbn);
    renderBookCatalogue(books);
    renderMemberList();
    updateStatisticsDisplay();
    renderOverdueBooks();
 * 
 */ 
function handleReturnSubmit(event) {
  event.preventDefault();

  const memberId = document.getElementById("return-member-id").value.trim();

  const isbn = document.getElementById("return-isbn").value.trim();

  if (!memberId || !isbn) {
    alert("Please complete all fields.");
    return;
  }

  try {
    processReturnQueue([
      {
        memberId,
        isbn,
      },
    ]);

    saveToLocalStorage();
    displayBookDetails(isbn);
    renderBookCatalogue(books);
    renderMemberList();
    updateStatisticsDisplay();
    renderOverdueBooks();

    event.target.reset();

    renderMemberMessage("return-message", "Book returned");
  } catch (error) {
    renderMemberMessage("return-message", error.message, "error");
  }
}

// ======================================================
// MEMBERS
// ======================================================
function createMemberForm() {
  const formContainer = document.getElementById("member-form");

  formContainer.innerHTML = `
        <h2>Add New Member</h2>

        <p class="form-description">
            Register a new library member by completing the form below.
        </p>

        <form id="member-registration-form">

            <label for="name">Name</label>
            <input
                type="text"
                id="name"
                placeholder="Enter member name"
                required
            >

            <label for="email">Email</label>
            <input
                type="email"
                id="email"
                placeholder="Enter email address"
                required
            >

            <label for="member-id">Member ID</label>
            <input
                type="text"
                id="member-id"
                placeholder="Enter member ID"
                required
            >

            <button type="submit">
                Add Member
            </button>

        </form>
    `;

  document
    .getElementById("member-registration-form")
    .addEventListener("submit", handleMemberSubmit);
}

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

members.forEach((member) => {
    const card = document.createElement("div");
    card.className = "member-card";

    const initials = member.name
        .split(" ")
        .map(word => word[0])
        .join("")
        .toUpperCase();

    card.innerHTML = `
        <div class="member-header">
            <div class="member-avatar">${initials}</div>

            <div class="member-info">
                <h3>${member.name}</h3>
                <span class="member-id">Member id: ${member.id}</span>
            </div>
        </div>

        <div class="member-body">

            <div class="member-row">
                <span>Email</span>
                <strong>${member.email}</strong>
            </div>

            <div class="member-row">
                <span>Membership</span>
                <strong>${member.membershipType}</strong>
            </div>

            <div class="member-row">
                <span>Borrowed Books</span>
                <strong>${member.borrowedBooks.length}</strong>
            </div>

        </div>

        <div class="member-actions">
            <button
                type="submit"
                class="edit-member"
                data-id="${member.id}">
                Edit
            </button>
        </div>
    `;

    container.appendChild(card);
});
}

function handleMemberSubmit(event) {
  event.preventDefault();

  const form = event.target;

  const id = form.querySelector("#member-id").value.trim();
  const name = form.querySelector("#name").value.trim();
  const email = form.querySelector("#email").value.trim();

  if (!id || !name || !email) {
    renderMemberMessage(
      "return-message",
      "Please complete all fields.",
      "error",
    );
    return;
  }

  const exists = members.some((member) => member.id === id);

  if (exists) {
    renderMemberMessage("return-message", "Member ID already exists.", "error");
    return;
  }

  const newMember = new Member(id, name, email, "standard");

  members.push(newMember);
  saveToLocalStorage();
  renderMemberList();
  updateStatisticsDisplay();
  renderMemberMessage(
    "member-message",
    "Member registered successfully.",
    "success",
  );
  event.target.reset();
}

function handleMemberClick(event) {
  const button = event.target.closest(".edit-member");

  if (!button) {
    return;
  }

  const id = button.dataset.id;

  showEditMemberForm(id);
}

function showEditMemberForm(id) {
  const member = findMemberById(id);

  if (!member) {
    alert("Member not found.");
    return;
  }

  const formContainer = document.getElementById("member-form");

  formContainer.innerHTML = `
            <h2>Edit Member : ${member.name}</h2>

            <p class="form-description">
                Update this member's information below.
            </p>

            <form id="edit-member-form">
                <h4>Member name</h4>    
                <input
                    id="name"
                    value="${member.name}"
                    required
                >
                <h4>Member email</h4>
                <input
                    id="email"
                    value="${member.email}"
                    required
                >
                <h4>Membership type</h4>
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

  editMemberForm = document.getElementById("edit-member-form");
  cancelEditButton = document.getElementById("cancel-edit");
  deleteMemberButton = document.getElementById("delete-member");

  editingMemberId = id;

  setupEditMemberEventListeners();

  const form = document.getElementById("member-form");

  form.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  document.getElementById("name").focus();
}

function handleEditMemberSubmit(event, id) {
  event.preventDefault();
  const member = findMemberById(editingMemberId);

  if (!member) {
    renderMemberMessage("member-message", "Member not found.", "error");
    return false;
  }

  const updates = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    membershipType: document.getElementById("membership-type").value,
  };

  updateMemberInfo(member, updates);

  saveToLocalStorage();

  renderMemberList();
  createMemberForm();
  renderMemberMessage("member-message", "Member updated.", "success");
}

function handleCancelEdit() {
  createMemberForm();
}

function handleDeleteMember(event) {
  event.preventDefault();
  event.stopPropagation();

  const member = findMemberById(editingMemberId);

  if (!member) {
    renderMemberMessage("member-message", "Member not found.", "error");
    return;
  }

  // Build return queue
  const queue = member.borrowedBooks.map((isbn) => ({
    memberId: member.id,
    isbn,
  }));

  // Return all borrowed books
  processReturnQueue(queue);

  // Delete the member
  deleteMember(member.id);

  saveToLocalStorage();
  loadCatalogue();
  renderMemberList();
  createMemberForm();
  renderMemberMessage("member-message", "Member deleted.", "error");
}
// ======================================================
// STATISTICS
// ======================================================

function updateStatisticsDisplay() {
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
}

function renderOverdueBooks() {
  const book = findOverdueBooks();
  
  const count = document.getElementById("overdue-count");

  const list = document.getElementById("overdue-list");

  if (!count || !list) {
    return;
  }

  count.textContent = book.length;

  list.innerHTML = "";

  if (book.length === 0) {
    list.innerHTML = `
            <p class="empty-message">
                No overdue books
            </p>
        `;

    return;
  }
  
  book.forEach((book) => {
    const fine = calculateFineAmount(book.daysLate);
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
                    <p>
                    <span>Fine:</span>
                    R${fine.toFixed(2)}
                    </p>

                </div>
            `;
  });
}

// ======================================================
// HELPERS
// ======================================================

function renderMemberMessage(id, message, type = "success") {
  const container = document.getElementById(id);

  container.innerHTML = `
        <div class="member-message ${type}">
            ${message}
        </div>
    `;
  setTimeout(() => {
    container.innerHTML = "";
  }, 6000);
}


  document.addEventListener("DOMContentLoaded", () => {
    initializeUI();
  });


export {
  initializeUI,
  renderBookCatalogue,
  handleSearch,
  handleFilterChange,
  setupEventListeners,
  handleBorrowSubmit,
  updateStatisticsDisplay,
  renderMemberList,
  showEditMemberForm,
  handleEditMemberSubmit,
  handleDeleteMember,
  renderOverdueBooks,
  renderMemberMessage,
  handleReturnSubmit,
  handleCancelEdit
};