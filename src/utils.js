import { books, members, Member, Book } from "../src/library.js";

export function initializeLibrary() {

    if (books.length > 0) return;

    books.push(
        new Book(
            "9780134685991",
            "Effective JavaScript",
            "David Herman",
            2012,
            2,
            "reference"
        ),
        new Book(
            "9781491950296",
            "Learning React",
            "Alex Banks",
            2020,
            1,
            "non-fiction"
        )
    );

    members.push(
        new Member(
            "M001",
            "John Smith",
            "john@gmail.com",
            "standard"
        )
    );

}