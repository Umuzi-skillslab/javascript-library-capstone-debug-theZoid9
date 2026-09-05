import {
  books,
  members,
  Book,
  DigitalBook,
  Member,
  PremiumMember,
} from "./library.js";

export function saveToLocalStorage() {
  try {
    localStorage.setItem("libraryBooks", JSON.stringify(books));

    localStorage.setItem("libraryMembers", JSON.stringify(members));

  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}


export function loadFromLocalStorage() {
  try {
    const booksData = JSON.parse(localStorage.getItem("libraryBooks")) || [];

    const membersData =
      JSON.parse(localStorage.getItem("libraryMembers")) || [];

    if (booksData.length === 0 && membersData.length === 0) {
      return false;
    }

    // Prevent duplicates
    books.length = 0;
    members.length = 0;

    // Restore Books
    booksData.forEach((data) => {
      let book;

      if (data.fileSize !== undefined) {
        book = new DigitalBook(
          data.isbn,
          data.title,
          data.author,
          data.year,
          data.totalCopies,
          data.category,
          data.fileSize,
          data.format,
          data.cover,
          data.pdf
        );
      } else {
        book = new Book(
          data.isbn,
          data.title,
          data.author,
          data.year,
          data.totalCopies,
          data.category,
          data.cover,
          data.pdf
        );
      }

      book.availableCopies = data.availableCopies;
      book.checkedOut = data.checkedOut || [];
      book.downloads = data.downloads ?? 0;
      book.downloadHistory = data.downloadHistory ?? [];

      books.push(book);
    });

    // Restore Members
    membersData.forEach((data) => {
      let member;

      if (data.membershipType === "premium") {
        member = new PremiumMember(data.id, data.name, data.email);
      } else {
        member = new Member(
          data.id,
          data.name,
          data.email,
          data.membershipType,
        );
      }

      member.borrowedBooks = data.borrowedBooks || [];

      member.joinDate = new Date(data.joinDate);

      members.push(member);
    });

    return true;
  } catch (error) {
  

    books.length = 0;
    members.length = 0;

    return false;
  }
}

export function exportLibraryData() {
  try {
    return JSON.stringify(
      {
        books,
        members,
      },
      null,
      2,
    );
  } catch (error) {
    console.error("Error exporting library data:", error);

    return null;
  }
}

export function importLibraryData(jsonString) {
  try {
    const data = JSON.parse(jsonString);

    if (!Array.isArray(data.books) || !Array.isArray(data.members)) {
      throw new Error("Invalid library data.");
    }

    localStorage.setItem("libraryBooks", JSON.stringify(data.books));

    localStorage.setItem("libraryMembers", JSON.stringify(data.members));

    loadFromLocalStorage();

  } catch (error) {
     return false;
  }
}
