/**
 * @jest-environment jsdom
 */

import {
  initializeUI,
  renderBookCatalogue,
  handleSearch,
  handleFilterChange,
  handleBorrowSubmit,
  updateStatisticsDisplay,
  showEditMemberForm,
  handleEditMemberSubmit,
  handleDeleteMember,
  renderOverdueBooks,
  renderMemberMessage,
  handleCancelEdit
  
} from "../src/ui.js";

import {
  books,
  members,
  Book,
  Member,
} from "../src/library.js";
import { jest } from "@jest/globals";

Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  value: () => {},
});

Object.defineProperty(HTMLElement.prototype, "focus", {
  value: () => {},
});
beforeEach(() => {
  document.body.innerHTML = `
    <button id="catalogue-tab"></button>
    <button id="members-tab"></button>
    <button id="statistics-tab"></button>

    <section id="catalogue-section"></section>
    <section id="borrow-section"></section>
    <section id="member-section"></section>
    <section id="statistics-section"></section>
    <section id="return-section"></section>

    <input id="search" />

    <select id="filter-category">
      <option value="all">all</option>
      <option value="Programming">Programming</option>
      <option value="Web">Web</option>
    </select>

    <form id="borrow-form">
      <input id="member-id" />
      <input id="isbn" />
    </form>

    <div id="catalogue-list"></div>
    <div id="book-details" class="hidden"></div>

    <div id="member-list"></div>
    <div id="member-form"></div>

    <div id="borrow-message"></div>
    <div id="member-message"></div>
    <div id="return-message"></div>

    <div class="total-books"></div>
    <div class="total-members"></div>
    <div class="available-books"></div>
    <div class="books-borrowed"></div>

    <div id="overdue-count"></div>
    <div id="overdue-list"></div>
  `;

  books.length = 0;
  members.length = 0;

  books.push(
    new Book("111", "JavaScript", "John", 2024, 2, "Programming"),
    new Book("222", "CSS", "Jane", 2023, 1, "Web")
  );

  members.push(
    new Member("M001", "John", "john@test.com", "standard")
  );

  localStorage.clear();

  initializeUI();
});

describe("renderBookCatalogue", () => {

   test("renders all books", () => {
    const list = document.getElementById("catalogue-list");
    list.innerHTML = "";

    renderBookCatalogue(books);

    expect(document.querySelectorAll(".book-card")).toHaveLength(2);
    });

  test("renders empty message", () => {

    renderBookCatalogue([]);

    expect(
      document.getElementById("catalogue-list").textContent
    ).toContain("No books found");

  });

});

describe("book details", () => {

  test("clicking a card shows details", () => {

    document
      .querySelector(".book-card")
      .dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
        })
      );

    expect(
      document.getElementById("book-details").innerHTML
    ).toContain("JavaScript");

  });

});

describe("search", () => {

  test("filters by title", () => {

    const input =
      document.getElementById("search");

    input.value = "css";

    handleSearch({
      target: input,
    });

    expect(
      document.querySelectorAll(".book-card")
    ).toHaveLength(1);

  });

});

describe("filter", () => {

  test("filters by category", () => {

    const filter =
      document.getElementById("filter-category");

    filter.value = "Programming";

    handleFilterChange();

    expect(
      document.querySelectorAll(".book-card")
    ).toHaveLength(1);

  });

});

describe("statistics", () => {

    test("statistics does not throw when elements are missing", () => {
  document.body.innerHTML = "";

  expect(() => {
    updateStatisticsDisplay();
  }).not.toThrow();
});

  test("updates statistics", () => {

    updateStatisticsDisplay();

    expect(
      document.querySelector(".total-books").textContent
    ).toBe("2");

    expect(
      document.querySelector(".total-members").textContent
    ).toBe("1");

    expect(
      document.querySelector(".available-books").textContent
    ).toBe("3");

  });

});

describe("borrow form", () => {

    test("missing fields shows validation", () => {
    const form = document.getElementById("borrow-form");

    handleBorrowSubmit({
        preventDefault: () => {},
        target: form,
    });

    expect(
        document.getElementById("borrow-message").textContent
    ).toContain("Please complete");
    });

});

describe("navigation", () => {
  test("catalogue tab shows catalogue section", () => {
    document.getElementById("catalogue-tab").click();

    expect(
      document.getElementById("catalogue-section").style.display
    ).toBe("block");

    expect(
      document.getElementById("borrow-section").style.display
    ).toBe("block");
  });

  test("members tab shows member section", () => {
    document.getElementById("members-tab").click();

    expect(
      document.getElementById("member-section").style.display
    ).toBe("block");
  });

  test("statistics tab shows statistics section", () => {
    document.getElementById("statistics-tab").click();

    expect(
      document.getElementById("statistics-section").style.display
    ).toBe("block");
  });
});

// 1% lines covered 
describe("member rendering", () => {
    test("renders member success message", () => {
  renderMemberMessage(
    "member-message",
    "Saved",
    "success"
  );

  expect(
    document.getElementById("member-message").textContent
  ).toContain("Saved");
});

  test("renders empty member message", () => {
    members.length = 0;

    document.getElementById("members-tab").click();

    expect(
      document.getElementById("member-list").textContent
    ).toContain("No members");
  });
});

describe("member registration", () => {

  test("edit submit shows error if member no longer exists", () => {
  members.length = 0;

  handleEditMemberSubmit({
    preventDefault() {},
  });

  expect(
    document.getElementById("member-message").textContent
  ).toContain("Member not found.");
});

  test("adds new member", () => {
    document.getElementById("members-tab").click();

    document.getElementById("name").value = "Mike";
    document.getElementById("email").value = "mike@test.com";
    document.getElementById("member-id").value = "M500";

    document
      .getElementById("member-registration-form")
      .dispatchEvent(
        new Event("submit", {
          bubbles: true,
          cancelable: true,
        })
      );

    expect(members.length).toBe(1);

    expect(
      document.getElementById("member-message").textContent
    ).toContain("");
  });

  test("delete member shows error when member does not exist", () => {
  members.length = 0;

  handleDeleteMember({
    preventDefault() {},
    stopPropagation() {},
  });

  expect(
    document.getElementById("member-message").textContent
  ).toContain("Member not found.");
});


});

describe("statistics extra", () => {
  test("borrowed books stat updates", () => {
    books[0].checkedOut.push({
      memberId: "M001",
    });

    updateStatisticsDisplay();

    expect(
      document.querySelector(".books-borrowed").textContent
    ).toBe("1");
  });

  test("available books stat changes", () => {
    books[0].availableCopies = 0;

    updateStatisticsDisplay();

    expect(
      document.querySelector(".available-books").textContent
    ).toBe("1");
  });
});

describe("catalogue rendering", () => {
  test("contains title", () => {
    expect(
      document.body.textContent
    ).toContain("JavaScript");
  });


});



describe("catalogue updates", () => {
  test("renderBookCatalogue replaces empty message", () => {
    renderBookCatalogue([]);

    expect(
      document.getElementById("catalogue-list").textContent
    ).toContain("No books");

    document.getElementById("catalogue-list").innerHTML = "";

    renderBookCatalogue(books);

    expect(
      document.querySelectorAll(".book-card")
    ).toHaveLength(2);
  });

  test("book cards contain isbn dataset", () => {
    expect(
      document.querySelector(".book-card").dataset.isbn
    ).toBe("111");
  });

  test("book card contains title", () => {
    expect(
      document.querySelector(".book-card h3").textContent
    ).toBe("JavaScript");
  });
});

describe("search additional", () => {
  test("search by author", () => {
    const input = document.getElementById("search");

    input.value = "jane";

    handleSearch({ target: input });

    expect(
      document.querySelectorAll(".book-card")
    ).toHaveLength(1);
  });

  test("search no matches", () => {
    const input = document.getElementById("search");

    input.value = "xxxxx";

    handleSearch({ target: input });

    expect(
      document.getElementById("catalogue-list").textContent
    ).toContain("No books");
  });
});

describe("statistics changes", () => {
  test("statistics update after removing book", () => {
    books.pop();

    updateStatisticsDisplay();

    expect(
      document.querySelector(".total-books").textContent
    ).toBe("1");
  });

  test("statistics update after adding member", () => {
    members.push(
      new Member(
        "M009",
        "Bob",
        "bob@test.com",
        "standard"
      )
    );

    updateStatisticsDisplay();

    expect(
      document.querySelector(".total-members").textContent
    ).toBe("2");
  });
});

describe("borrow validation", () => {

    test("renders no overdue books message", () => {
  renderOverdueBooks();

  expect(
    document.getElementById("overdue-list").textContent
  ).toContain("No overdue books");
});

  test("blank member id fails", () => {
    document.getElementById("isbn").value = "111";

    handleBorrowSubmit({
      preventDefault() {},
      target: document.getElementById("borrow-form"),
    });

    expect(
      document.getElementById("borrow-message").textContent
    ).toContain("Please complete");
  });

  test("blank isbn fails", () => {
    document.getElementById("member-id").value = "M001";

    handleBorrowSubmit({
      preventDefault() {},
      target: document.getElementById("borrow-form"),
    });

    expect(
      document.getElementById("borrow-message").textContent
    ).toContain("Please complete");
  });
});

describe("member ui", () => {
  beforeEach(() => {
    document.getElementById("members-tab").click();
  });

  test("member card contains edit button", () => {
    expect(
      document.querySelector(".edit-member")
    ).not.toBeNull();
  });

  test("edit button stores member id", () => {
    expect(
      document.querySelector(".edit-member").dataset.id
    ).toBe("M001");
  });

  test("clicking edit creates edit form", () => {
    document.querySelector(".edit-member").click();

    expect(
      document.getElementById("edit-member-form")
    ).not.toBeNull();
  });

  test("cancel returns registration form", () => {
    document.querySelector(".edit-member").click();

    document
      .getElementById("cancel-edit")
      .click();

    expect(
      document.getElementById("member-registration-form")
    ).not.toBeNull();
  });


  
});

