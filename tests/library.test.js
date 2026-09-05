import {
  initializeLibrary,
  searchBooks,
  filterBooksByCategory,
  getLibraryStatistics,
  processReturnQueue,
} from "../src/utils.js";
import { jest } from "@jest/globals";

import {
  Book,
  DigitalBook,
  Member,
  PremiumMember,
  borrowBook,
  books,
  members,
  findBookByISBN,
  calculateFineAmount,
  formatBookInfo,
  searchBooksByCategory,
  combineBookCollections,
  addMultipleBooks,
  updateMemberInfo,
  calculateTotalLateFees,
  findOverdueBooks,
  LibraryStats,
  deleteMember,
  getBooksByAuthor,
} from "../src/library.js";

import {
  saveToLocalStorage,
  loadFromLocalStorage,
  exportLibraryData,
  importLibraryData,
} from "../src/storage.js";

describe("Book", () => {
  test("constructor, availability and info", () => {
    const book = new Book(
      "123",
      "Clean Code",
      "Robert Martin",
      2008,
      2,
      "Programming",
    );

    expect(book.isbn).toBe("123");
    expect(book.title).toBe("Clean Code");
    expect(book.author).toBe("Robert Martin");
    expect(book.availableCopies).toBe(2);
    expect(book.totalCopies).toBe(2);
    expect(book.isAvailable()).toBe(true);

    expect(book.getInfo()).toBe(
      "Clean Code by Robert Martin (2008) - ISBN: 123",
    );
  });

  test("successful checkout updates state", () => {
    const book = new Book(
      "123",
      "Clean Code",
      "Robert Martin",
      2008,
      2,
      "Programming",
    );

    expect(book.checkOut("M1")).toBe(true);

    expect(book.availableCopies).toBe(1);

    expect(book.checkedOut).toContainEqual(
      expect.objectContaining({
        memberId: "M1",
      }),
    );
  });

  test("checkout validates input", () => {
    const book = new Book("1", "JS", "John", 2024, 1, "Programming");

    expect(() => book.checkOut()).toThrow();
    expect(() => book.checkOut({})).toThrow();
    expect(() => book.checkOut(true)).toThrow();

    book.checkOut("M1");

    expect(() => book.checkOut("M2")).toThrow(
      "No available copies to check out",
    );
  });

  test("book unavailable after last copy", () => {
    const book = new Book("1", "JS", "John", 2024, 1, "Programming");

    book.checkOut("M1");

    expect(book.isAvailable()).toBe(false);
  });
});

describe("DigitalBook", () => {
  test("inherits and downloads", () => {
    const book = new DigitalBook(
      "1",
      "JavaScript",
      "John",
      2024,
      1,
      "Programming",
      25,
      "pdf",
    );

    expect(book instanceof DigitalBook).toBe(true);
    expect(book instanceof Book).toBe(true);

    expect(book.download("M1")).toBe(true);

    expect(book.downloads).toBe(1);
    expect(book.downloadHistory).toHaveLength(1);

    expect(() => book.download()).toThrow();
  });
});

describe("Member", () => {
  test("member methods", () => {
    const member = new Member(
      "M1",
      "John",
      "john@test.com",
      "standard",
    );

    expect(member.canBorrow()).toBe(true);

    member.borrowedBooks = ["1", "2", "3", "4", "5"];

    expect(member.canBorrow()).toBe(false);

    expect(member.getMembershipDuration()).toBeGreaterThanOrEqual(0);

    expect(member.getMemberInfo()).toEqual({
      id: "M1",
      name: "John",
      email: "john@test.com",
      membershipType: "standard",
    });
  });
});

describe("PremiumMember", () => {
  test("premium member overrides borrowing rules", () => {
    const premium = new PremiumMember(
      "M1",
      "Sarah",
      "sarah@test.com",
    );

    expect(premium instanceof Member).toBe(true);

    expect(premium.membershipType).toBe("premium");

    premium.borrowedBooks = Array(9).fill("book");

    expect(premium.canBorrow()).toBe(true);

    premium.borrowedBooks.push("book10");

    expect(premium.canBorrow()).toBe(false);
  });
});

describe("Library Functions", () => {
  beforeEach(() => {
    books.length = 0;
  });

  test("findBookByISBN", () => {
    const book = new Book(
      "123",
      "JavaScript",
      "John",
      2024,
      1,
      "Programming",
    );

    books.push(book);

    expect(findBookByISBN("123")).toBe(book);

    expect(findBookByISBN("999")).toBeUndefined();

    expect(findBookByISBN(undefined)).toBeNull();

    expect(findBookByISBN(123)).toBeNull();
  });
  
});

describe("Formatting and Math", () => {


  test("calculateFineAmount", () => {
    expect(calculateFineAmount(5)).toBe(2.5);
    expect(calculateFineAmount(undefined)).toBe(0);
    expect(calculateFineAmount(NaN)).toBe(0);
    expect(calculateFineAmount(-2)).toBe(-1);
  });
});

describe("LocalStorage", () => {
  beforeEach(() => {
    const storage = {};

    global.localStorage = {
      getItem: (key) => storage[key] ?? null,
      setItem: (key, value) => {
        storage[key] = value;
      },
      removeItem: (key) => delete storage[key],
      clear: () => Object.keys(storage).forEach((k) => delete storage[k]),
    };

    books.length = 0;
    members.length = 0;

    books.push(
      new Book(
        "9780134685991",
        "Effective JavaScript",
        "David Herman",
        2012,
        6,
        "reference",
      ),
    );

    members.push(
      new Member(
        "M001",
        "John Smith",
        "john@gmail.com",
        "standard",
      ),
    );
  });

  test("save and load localStorage", () => {
    saveToLocalStorage();

    books.length = 0;
    members.length = 0;

    expect(loadFromLocalStorage()).toBe(true);

    expect(books).toHaveLength(1);
    expect(members).toHaveLength(1);
  });

  test("export and import library", () => {
    const json = exportLibraryData();

    const parsed = JSON.parse(json);

    expect(parsed).toHaveProperty("books");
    expect(parsed).toHaveProperty("members");

    books.length = 0;
    members.length = 0;

    importLibraryData(json);

    expect(books).toHaveLength(1);
    expect(members).toHaveLength(1);
  });

  test("handles empty storage and invalid json", () => {
    localStorage.clear();

    expect(loadFromLocalStorage()).toBe(false);

    expect(() => importLibraryData("{bad json}")).not.toThrow();
  });
});

describe("Utility Functions", () => {
  beforeEach(() => {
    books.length = 0;
    members.length = 0;
  });

  test("searchBooks", () => {
    initializeLibrary();


    expect(searchBooks(books, "m")).toHaveLength(4);

    expect(searchBooks(books, "python")).toEqual([]);
  });

  test("filterBooksByCategory", () => {
    initializeLibrary();


    expect(filterBooksByCategory(books, "all")).toHaveLength(7);

  });


});

describe("processReturnQueue", () => {
  beforeEach(() => {
    books.length = 0;
    members.length = 0;

    const book = new Book(
      "123",
      "JavaScript",
      "John",
      2024,
      0,
      "reference",
    );

    book.checkedOut.push({
      memberId: "M001",
      dueDate: "2026-08-01",
    });

    const member = new Member(
      "M001",
      "John",
      "john@test.com",
      "standard",
    );

    member.borrowedBooks.push("123");

    books.push(book);
    members.push(member);
  });

  test("returns borrowed book", () => {
    processReturnQueue([
      {
        isbn: "123",
        memberId: "M001",
      },
    ]);

    expect(books[0].availableCopies).toBe(1);
    expect(books[0].checkedOut).toHaveLength(0);
    expect(members[0].borrowedBooks).toEqual([]);
  });

  test("throws expected errors", () => {
    expect(() =>
      processReturnQueue([
        {
          isbn: "999",
          memberId: "M001",
        },
      ]),
    ).toThrow("Book not found.");

    expect(() =>
      processReturnQueue([
        {
          isbn: "123",
          memberId: "M999",
        },
      ]),
    ).toThrow("Member not found.");

    books[0].checkedOut = [];

    expect(() =>
      processReturnQueue([
        {
          isbn: "123",
          memberId: "M001",
        },
      ]),
    ).toThrow("This member did not borrow this book.");
  });

  test("processes multiple returns", () => {
    const secondBook = new Book(
      "456",
      "React",
      "Alex",
      2024,
      0,
      "Programming",
    );

    secondBook.checkedOut.push({
      memberId: "M001",
      dueDate: "2026-08-01",
    });

    books.push(secondBook);

    members[0].borrowedBooks.push("456");

    processReturnQueue([
      {
        isbn: "123",
        memberId: "M001",
      },
      {
        isbn: "456",
        memberId: "M001",
      },
    ]);

    expect(members[0].borrowedBooks).toEqual([]);
    expect(books[0].availableCopies).toBe(1);
    expect(books[1].availableCopies).toBe(1);
  });
});

describe("Additional Library Functions", () => {
  beforeEach(() => {
    books.length = 0;
    members.length = 0;
  });

  test("borrowBook success and failure", () => {
    const member = new Member(
      "M001",
      "John",
      "john@test.com",
      "standard",
    );

    const book = new Book(
      "123",
      "JavaScript",
      "John",
      2024,
      1,
      "Programming",
    );

    members.push(member);
    books.push(book);

    expect(borrowBook("123","M001")).toBe(true);

    expect(member.borrowedBooks).toContain("123");
    expect(book.availableCopies).toBe(0);

    expect(() => borrowBook("123","BADUSER")).toThrow("Member not found");
    expect(() => borrowBook("BADBOOK18+","M001")).toThrow("Book not found");
  });

  test("searchBooksByCategory", () => {
    const b1 = new Book("1", "JavaScript", "John", 2024, 1, "Programming");
    const b2 = new Book("2", "CSS", "Jane", 2024, 1, "Web");

    expect(searchBooksByCategory([b1, b2], "Programming")).toEqual([b1]);

    expect(searchBooksByCategory([], "Programming")).toEqual([]);

    expect(searchBooksByCategory(null, "Programming")).toEqual([]);
  });

  test("collection helper functions", () => {
    const b1 = new Book("1", "JS", "John", 2024, 1, "Programming");
    const b2 = new Book("2", "CSS", "Jane", 2024, 1, "Web");

    expect(combineBookCollections([b1], [b2], [])).toEqual([b1, b2]);

    addMultipleBooks(b1, b2);

    expect(books).toHaveLength(2);

    expect(getBooksByAuthor("John")).toEqual([b1]);
  });

  test("updateMemberInfo", () => {
    const member = new Member(
      "1",
      "Old",
      "old@test.com",
      "standard",
    );

    updateMemberInfo(member, {
      name: "New",
      email: "new@test.com",
      membershipType: "premium",
    });

    expect(member.name).toBe("New");
    expect(member.email).toBe("new@test.com");
    expect(member.membershipType).toBe("premium");
  });

  test("calculateTotalLateFees", () => {
    expect(
      calculateTotalLateFees({
        overdueBooks: [
          { daysLate: 2 },
          { daysLate: 4 },
        ],
      }),
    ).toBe(3);
  });

  test("findOverdueBooks", () => {
    const book = new Book(
      "1",
      "JavaScript",
      "John",
      2024,
      0,
      "Programming",
    );

    book.checkedOut.push({
      memberId: "M001",
      dueDate: "2020-01-01",
    });

    books.push(book);

    const overdue = findOverdueBooks();

    expect(overdue).toHaveLength(1);

    expect(overdue[0]).toEqual(
      expect.objectContaining({
        memberId: "M001",
        isbn: "1",
        title: "JavaScript",
      }),
    );
  });

  test("LibraryStats", () => {
    expect(LibraryStats.getMostPopularBook()).toBeNull();

    const book = new Book(
      "1",
      "JavaScript",
      "John",
      2024,
      1,
      "Programming",
    );

    book.checkedOut.push({
      memberId: "M001",
    });

    books.push(book);

    members.push(
      new Member(
        "M001",
        "John",
        "john@test.com",
        "standard",
      ),
    );

    expect(LibraryStats.getStatistics()).toEqual({
      totalBooks: 1,
      totalMembers: 1,
      totalBorrowings: 1,
    });

    expect(LibraryStats.getMostPopularBook()).toBe(book);
  });

  test("deleteMember", () => {
    members.push(
      new Member(
        "M001",
        "John",
        "john@test.com",
        "standard",
      ),
    );

    expect(deleteMember("M001")).toBe(true);

    expect(members).toHaveLength(0);
  });
  
});

describe("storage extra coverage", () => {
  beforeEach(() => {
    books.length = 0;
    members.length = 0;
    localStorage.clear();
    jest.restoreAllMocks();
  });

  test("loadFromLocalStorage returns false when storage is empty", () => {
    expect(loadFromLocalStorage()).toBe(false);
  });

  test("loadFromLocalStorage restores a DigitalBook", () => {
    localStorage.setItem(
      "libraryBooks",
      JSON.stringify([
        {
          isbn: "1",
          title: "JS",
          author: "Me",
          year: 2024,
          totalCopies: 1,
          availableCopies: 1,
          checkedOut: [],
          fileSize: 12,
          format: "pdf",
        },
      ])
    );

    localStorage.setItem("libraryMembers", JSON.stringify([]));

    loadFromLocalStorage();

    expect(books[0]).toBeInstanceOf(DigitalBook);
  });

  test("loadFromLocalStorage restores PremiumMember", () => {
    localStorage.setItem("libraryBooks", JSON.stringify([]));

    localStorage.setItem(
      "libraryMembers",
      JSON.stringify([
        {
          id: "M1",
          name: "John",
          email: "a@a.com",
          membershipType: "premium",
          borrowedBooks: [],
          joinDate: new Date(),
        },
      ])
    );

    loadFromLocalStorage();

    expect(members[0].membershipType).toBe("premium");
  });

  test("loadFromLocalStorage returns false for invalid JSON", () => {
    localStorage.setItem("libraryBooks", "{");

    expect(loadFromLocalStorage()).toBe(false);
    expect(books).toHaveLength(0);
    expect(members).toHaveLength(0);
  });

  test("importLibraryData returns false for wrong structure", () => {
    expect(importLibraryData("{}")).toBe(false);
  });

  test("importLibraryData imports valid data", () => {
    const json = JSON.stringify({
      books: [
        {
          isbn: "1",
          title: "Book",
          author: "Author",
          year: 2024,
          totalCopies: 1,
          availableCopies: 1,
          checkedOut: [],
          category: "Programming",
        },
      ],
      members: [
        {
          id: "M1",
          name: "John",
          email: "a@a.com",
          membershipType: "standard",
          borrowedBooks: [],
          joinDate: new Date(),
        },
      ],
    });

    importLibraryData(json);

    expect(books).toHaveLength(1);
    expect(members).toHaveLength(1);
  });
});