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
} from "../src/ui.js";

import {
  books,
  members,
  Book,
  Member,
} from "../src/library.js";
import { jest } from "@jest/globals";
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