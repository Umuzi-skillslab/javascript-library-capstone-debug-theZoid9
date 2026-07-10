import { books, Member, members } from "../src/library.js";
import {initializeLibrary, searchBooks, filterBooksByCategory, getLibraryStatistics} from "./utils.js"

const jsonString = JSON.stringify({
    books,
    members
});


export function saveToLocalStorage() {

    try {
        localStorage.setItem("libraryBooks", JSON.stringify(books));
        localStorage.setItem("libraryMembers", JSON.stringify(members));

        console.log("Library data saved.");
    } catch (error) {
        console.error("Error saving to localStorage:", error);
    }
}

export function loadFromLocalStorage() {
    try {
        const booksData = JSON.parse(localStorage.getItem("libraryBooks")) || [];
    
        const membersData = JSON.parse(localStorage.getItem("libraryMembers")) || [];
        if(!booksData || membersData){
            return false;
        }
        // Replace contents of the existing arrays
        books.push(...booksData);
        members.push(...membersData);

        return true;
        console.log("Library data loaded.");
    } catch (error) {
        console.error("Error loading from localStorage:", error);

        books.length = 0;
        members.length = 0;
    }
}

export function exportLibraryData() {
    try {
        const data = {
            books: books,
            members: members
        };

        return JSON.stringify(data, null, 2); // Pretty-printed JSON
    } catch (error) {
        console.error("Error exporting library data:", error);
        return null;
    }
}

export function importLibraryData(jsonString) {
    try {
        const data = JSON.parse(jsonString);

        if (!Array.isArray(data.books) || !Array.isArray(data.members)) {
            throw new Error("Invalid library data format.");
        }

        // Replace contents of the existing arrays
        books.length = 0;
        books.push(...data.books);

        members.length = 0;
        members.push(...data.members);

        // Save imported data
        saveToLocalStorage();

        console.log("Library data imported successfully.");
    } catch (error) {
        console.error("Error importing library data:", error);
    }
}