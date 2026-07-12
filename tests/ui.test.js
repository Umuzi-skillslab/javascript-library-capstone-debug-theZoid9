/**
 * @jest-environment jsdom
 */

import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/library.js", () => ({
  books: [],
  members: [],
  borrowBook: jest.fn(),
  findBookByISBN: jest.fn(),
  formatBookInfo: jest.fn(),
  Member: class {},
  Book: class {},
  findMemberById: jest.fn(),
  updateMemberInfo: jest.fn(),
  findOverdueBooks: jest.fn(() => []),
  deleteMember: jest.fn(),
}));

jest.unstable_mockModule("../src/storage.js", () => ({
  saveToLocalStorage: jest.fn(),
  loadFromLocalStorage: jest.fn(() => true),
}));

jest.unstable_mockModule("../src/utils.js", () => ({
  initializeLibrary: jest.fn(),
  searchBooks: jest.fn(() => []),
  filterBooksByCategory: jest.fn(() => []),
  getLibraryStatistics: jest.fn(() => ({
    totalBooks: 10,
    totalMembers: 5,
    availableBooks: 7,
    borrowedBooks: 3,
  })),
  processReturnQueue: jest.fn(),
}));

const ui = await import("../src/ui.js");
const library = await import("../src/library.js");
const storage = await import("../src/storage.js");
const utils = await import("../src/utils.js");

describe("renderBookCatalogue", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="catalogue-list"></div>
    `;
  });

  test("renders books", () => {
    ui.renderBookCatalogue([
      {
        isbn: "1",
        title: "JavaScript",
        author: "John",
        category: "Programming",
        year: 2024,
        availableCopies: 2,
      },
    ]);

    expect(document.querySelectorAll(".book-card")).toHaveLength(1);
    expect(document.body.textContent).toContain("JavaScript");
  });

  test("renders empty message", () => {
    ui.renderBookCatalogue([]);

    expect(document.body.textContent).toContain("No books found.");
  });

  test("handles null", () => {
    ui.renderBookCatalogue(null);

    expect(document.body.textContent).toContain("No books found.");
  });
});

describe("handleSearch", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <input id="search">
      <div id="catalogue-list"></div>
    `;
  });

  test("calls searchBooks", () => {
    ui.handleSearch({
      target: {
        value: "javascript",
      },
    });

    expect(utils.searchBooks).toHaveBeenCalled();
  });
});

describe("handleBorrowSubmit", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="borrow-form">
        <input id="member-id">
        <input id="isbn">
      </form>

      <div id="borrow-message"></div>
      <div id="catalogue-list"></div>
    `;
  });

  test("shows validation message", () => {
    ui.handleBorrowSubmit({
      preventDefault: jest.fn(),
      target: {
        reset: jest.fn(),
      },
    });

    expect(document.body.textContent).toContain(
      "Please complete all fields."
    );
  });

  test("successful borrow", () => {
    library.borrowBook.mockReturnValue(true);

    document.getElementById("member-id").value = "M001";
    document.getElementById("isbn").value = "123";

    ui.handleBorrowSubmit({
      preventDefault: jest.fn(),
      target: {
        reset: jest.fn(),
      },
    });

    expect(library.borrowBook).toHaveBeenCalled();
    expect(storage.saveToLocalStorage).toHaveBeenCalled();
  });

  test("borrow throws", () => {
    library.borrowBook.mockImplementation(() => {
      throw new Error("Book unavailable");
    });

    document.getElementById("member-id").value = "M001";
    document.getElementById("isbn").value = "123";

    ui.handleBorrowSubmit({
      preventDefault: jest.fn(),
      target: {
        reset: jest.fn(),
      },
    });

    expect(document.body.textContent).toContain("Book unavailable");
  });
});

describe("updateStatisticsDisplay", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <span class="total-books"></span>
      <span class="total-members"></span>
      <span class="available-books"></span>
      <span class="books-borrowed"></span>
    `;
  });

  test("updates statistics", () => {
    ui.updateStatisticsDisplay();

    expect(document.querySelector(".total-books").textContent).toBe("10");
    expect(document.querySelector(".total-members").textContent).toBe("5");
    expect(document.querySelector(".available-books").textContent).toBe("7");
    expect(document.querySelector(".books-borrowed").textContent).toBe("3");
  });

  test("does not throw if elements are missing", () => {
    document.body.innerHTML = "";

    expect(() => ui.updateStatisticsDisplay()).not.toThrow();
  });
});