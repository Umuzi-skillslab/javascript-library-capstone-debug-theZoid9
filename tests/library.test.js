// Jest Tests - Library Management System
// Incomplete and with errors

import { borrowBook,Book, DigitalBook, Member,members, PremiumMember,findBookByISBN,books,calculateFineAmount } from "../src/library.js";

describe('Book Class', () => {
    test('should create a book instance', () => {
        const book = new Book('978-0-123', 'Test Book', 'Author Name', 2020, 5);
        
        expect(book.isbn).toBe('978-0-123');
        expect(book.title).toBe('Test Book');
        expect(book.author).toBe('Author Name');
        expect(book.year).toBe(2020);
        expect(book.availableCopies).toBe(5);
        // Missing: tests for other properties
        // Missing: test for availableCopies
    });

// Missing: test for checkOut method
    test("should checkout book",() => {
          const book = new Book("123", "Clean Code", "Robert Martin", 2008, 2);

          expect(book.checkOut(2)).toBe(true);
    })

    test("checkOut decreases availableCopies and stores memberId", () => {
        const book = new Book("123", "Clean Code", "Robert Martin", 2008, 2);

        book.checkOut("user1");
        expect(book.availableCopies).toBe(1);
        expect(book.checkedOut).toContainEqual(
        expect.objectContaining({
            memberId: "user1"
        })
);
    });

    test("rejects invalid memberId types", () => {
        const book = new Book("123", "Title", "Author", 2024, 1);

        expect(() => book.checkOut()).toThrow();
        expect(() => book.checkOut({})).toThrow();
        expect(() => book.checkOut(true)).toThrow();
    });

    test("checkOut throws error when no copies available", () => {
        const book = new Book("123", "Clean Code", "Robert Martin", 2008, 1);

        book.checkOut("user1");

        expect(() => {
            book.checkOut("user2");
        }).toThrow("No available copies to check out");
    });

 // Missing: test for availability checking
    test("isAvailable returns true when copies exist", () => {
        const book = new Book("123", "Clean Code", "Robert Martin", 2008, 3);

        expect(book.isAvailable()).toBe(true);
    });

    test("isAvailable returns false when no copies left", () => {
        const book = new Book("123", "Clean Code", "Robert Martin", 2008, 1);

        book.checkOut("user1");

        expect(book.isAvailable()).toBe(false);
    });

// Missing: test for template literal methods
    test("getInfo returns formatted string", () => {
        const book = new Book("123", "Clean Code", "Robert Martin", 2008, 2);

        expect(book.getInfo()).toBe(
            "Clean Code by Robert Martin (2008) - ISBN: 123"
        );
    });

});

describe('DigitalBook Class', () => {
    // Missing: test for inheritance
    test("inherits from Book class", () => {
    const book = new DigitalBook(
        "123",
        "Clean Code",
        "Robert Martin",
        2008,
        1,
        5,
        "PDF"
    );

    expect(book instanceof DigitalBook).toBe(true);
    expect(book instanceof Book).toBe(true);

    });

// Missing: test for super() call
    test("initializes parent class properties via super()", () => {
        const book = new DigitalBook("123", "Clean Code", "Robert Martin", 2008, 3, 5, "PDF");

        expect(book.isbn).toBe("123");
        expect(book.title).toBe("Clean Code");
        expect(book.author).toBe("Robert Martin");
        expect(book.year).toBe(2008);
        expect(book.availableCopies).toBe(3);
    });

// Missing: test for download method
    test("download method tracks downloads correctly", () => {
        const book = new DigitalBook("123", "Clean Code", "Robert Martin", 2008, 1, 5, "PDF");

        book.download("user1");

        expect(book.downloads).toBe(1);
        expect(book.downloadHistory.length).toBe(1);
    });
    
});

describe('Member Class', () => {
    test('canBorrow returns boolean', () => {
        const member = new Member(1, 'John Doe', 'john@example.com', 'standard');
        const result = member.canBorrow();
        
        // Wrong assertion type // fix was a weak test

        expect(result).toBe(true);
    });
    
    // Missing: test for borrow limit
    test('returns false when member reaches limit', () => {
        const member = new Member(1, 'John', 'john@example.com', 'standard');

        member.borrowedBooks = ["1", "2", "3", "4", "5"];

        expect(member.canBorrow()).toBe(false);
    });
    
    // Missing: test for membership duration calculation
    test('returns true when under limit', () => {
        const member = new Member(1, 'John', 'john@example.com', 'standard');

        member.borrowedBooks = ["1", "2"];

        expect(member.canBorrow()).toBe(true);
});
});

describe('PremiumMember Class', () => {
    // Missing: all tests for premium member // 3 + tests fix
    // Missing: test for inheritance // fix
    test('PremiumMember is instance of Member', () => {
        const premium = new PremiumMember(
            1,
            'Sarah',
            'sarah@example.com'
        );

        expect(premium instanceof PremiumMember).toBe(true);
        expect(premium instanceof Member).toBe(true);
});
    // Missing: test for overridden methods // fix 
    test('sets membership type to premium', () => {
        const premium = new PremiumMember(
            1,
            "Uncle",
            "sarah@example.com"
        );
        expect(premium.membershipType).toBe('premium');
    })

    test('sets more book for premium members',() => {
        const premium = new PremiumMember(
            1,
            "Uncle",
            "sarah@example.com"
        );

        premium.borrowedBooks = [
            '1','2','3','4','5','6'
        ]

        expect(premium.canBorrow()).toBe(true);
    })
    
});

describe("Library Functions", () => {

    beforeEach(() => {
        books.length = 0;

        books.push(
            new Book(
                "978-0-123",
                "JavaScript Basics",
                "John Doe",
                2024,
                "Programming",
                5
            )
        );
    });

    test("findBookByISBN returns the correct book", () => {

        const book = findBookByISBN("978-0-123");

        expect(book).not.toBeUndefined();
        expect(book.isbn).toBe("978-0-123");
        expect(book.title).toBe("JavaScript Basics");
        expect(book.author).toBe("John Doe");
    });

    test("findBookByISBN returns undefined for unknown ISBN", () => {

        const book = findBookByISBN("999");

        expect(book).toBeUndefined();
    });

    test("findBookByISBN returns undefined when books array is empty", () => {

        books.length = 0;

        expect(findBookByISBN("978-0-123")).toBeUndefined();
    });

});


describe("Array Operations", () => {

    beforeEach(() => {
        books.length = 0;

        books.push(
            new Book("1", "JavaScript", "John", 2020, "Programming", 2),
            new Book("2", "CSS", "Jane", 2021, "Web", 3),
            new Book("3", "React", "John", 2022, "Programming", 1)
        );
    });

    test("filterBooksByCategory filters books correctly", () => {
        const result = filterBooksByCategory(books, "Programming");

        expect(result).toHaveLength(2);
    });

    test("searchBooks filters using title", () => {
        const result = searchBooks(books, "java");

        expect(result).toHaveLength(1);
        expect(result[0].title).toBe("JavaScript");
    });

    test("map returns all book titles", () => {
        const titles = books.map(book => book.title);

        expect(titles).toEqual([
            "JavaScript",
            "CSS",
            "React"
        ]);
    });

    test("reduce calculates total available copies", () => {
        const total = books.reduce(
            (sum, book) => sum + book.availableCopies,
            0
        );

        expect(total).toBe(6);
    });

    test("spread creates a copy of books array", () => {
        const copy = [...books];

        expect(copy).toEqual(books);
        expect(copy).not.toBe(books);
    });

    test("rest parameter collects arguments", () => {

        function total(...numbers) {
            return numbers.reduce((sum, value) => sum + value, 0);
        }

        expect(total(1, 2, 3, 4)).toBe(10);
    });

});

describe('Recursive Functions', () => {
    // Missing: test for searchBooksByCategory
    // Missing: test for base case
    // Missing: test for stack overflow prevention
});

describe('Error Handling', () => {
    // Missing: tests for try-catch blocks
    // Missing: tests for undefined/null handling
    // Missing: tests for type checking
       beforeEach(() => {
        books.length = 0;
        members.length = 0;
    });

    test("borrowBook throws when member does not exist", () => {

        expect(() => {
            borrowBook("M001", "123");
        }).toThrow("Member not found");

    });

    test("findBookByISBN returns null for undefined", () => {

        expect(
            findBookByISBN(undefined)
        ).toBeNull();

    });

    test("findBookByISBN returns null for wrong type", () => {

        expect(
            findBookByISBN(123)
        ).toBeNull();

    });
});

describe('String Operations', () => {
    // Missing: tests for formatBookInfo
    // Missing: tests for template literals
    // Missing: tests for string methods
    test("formatBookInfo returns HTML string", () => {

        const book = new Book(
            "1",
            "JavaScript",
            "John",
            2024,
            "Programming",
            5
        );

        const html = formatBookInfo(book);

        expect(typeof html).toBe("string");
        expect(html).toContain("JavaScript");
        expect(html).toContain("John");
    });

    test("formatBookInfo uses template literals", () => {

        const book = new Book(
            "1",
            "CSS",
            "Jane",
            2024,
            "Web",
            3
        );

        const html = formatBookInfo(book);

        expect(html).toContain("CSS");
        expect(html).toContain("Jane");
        expect(html).toContain("Web");
    });
    
});

describe('Math Operations', () => {
    test('calculateFineAmount returns number', () => {
        var fine = calculateFineAmount(5);
        
        expect(typeof fine).toBe('number');
        // Missing: test for correct calculation
        // Missing: test for toFixed/rounding
    });
    
    test("calculateFineAmount returns correct amount", () => {

        expect(
            calculateFineAmount(5)
        ).toBe(2.5);

    });

    test("returns zero for NaN", () => {

        expect(
            calculateFineAmount(NaN)
        ).toBe(0);

    });

    test("returns negative value for negative days", () => {

        expect(
            calculateFineAmount(-2)
        ).toBe(-1);

    });
    
    // Missing: test for NaN handling
    // Missing: test for negative numbers
});

describe('DOM Manipulation', () => {
    // Missing: DOM setup with jsdom
    // Missing: tests for event handlers
    // Missing: tests for renderBookCatalogue
    // Missing: tests for search functionality
});

describe("JSON Operations", () => {

    test("JSON.stringify converts object to string", () => {

        const member = {
            id: "M1",
            name: "John"
        };

        const json = JSON.stringify(member);

        expect(typeof json).toBe("string");
    });

    test("JSON.parse converts string to object", () => {

        const json = '{"id":"M1","name":"John"}';

        const member = JSON.parse(json);

        expect(member.id).toBe("M1");
    });

    test("JSON.parse throws on invalid JSON", () => {

        expect(() => {
            JSON.parse("{bad json}");
        }).toThrow();

    });

});

describe('LocalStorage', () => {
    // Missing: localStorage mock
    // Missing: tests for save functionality
    // Missing: tests for load functionality
    // Missing: tests for error handling
});

// Missing: describe blocks for:
// - Nested loops
// - For-of loops
// - Destructuring
// - Scope testing (var, let, const)
// - Module exports/imports
