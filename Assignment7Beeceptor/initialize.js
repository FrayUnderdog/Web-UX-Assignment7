// initialize.js - Use IIFE to limit scope

const apiUrl = "https://raybool.free.beeceptor.com";
const apiKey = "P_Bu9kZR316qwU6IOmJUvXZJQmP6sCNgk9gjBVaBBgXjE2jh3w";

(async function () {
    const initialBooks = [
        { name: "Harry Potter and the Philosopher's Stone", author: "J.K. Rowling", editorial: "Bloomsbury", edition: "1st", pages: 223 },
        // { name: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling", editorial: "Bloomsbury", edition: "1st", pages: 251 },
        // { name: "Harry Potter and the Prisoner of Azkaban", author: "J.K. Rowling", editorial: "Bloomsbury", edition: "1st", pages: 317 },
        // { name: "Harry Potter and the Goblet of Fire", author: "J.K. Rowling", editorial: "Bloomsbury", edition: "1st", pages: 636 },
        // { name: "Harry Potter and the Order of the Phoenix", author: "J.K. Rowling", editorial: "Bloomsbury", edition: "1st", pages: 766 },
        // { name: "Harry Potter and the Half-Blood Prince", author: "J.K. Rowling", editorial: "Bloomsbury", edition: "1st", pages: 607 },
        // { name: "Harry Potter and the Deathly Hallows", author: "J.K. Rowling", editorial: "Bloomsbury", edition: "1st", pages: 607 },
        // { name: "A Game of Thrones", author: "George R.R. Martin", editorial: "Bantam Spectra", edition: "1st", pages: 694 },
        // { name: "A Clash of Kings", author: "George R.R. Martin", editorial: "Bantam Spectra", edition: "1st", pages: 768 },
        // { name: "A Storm of Swords", author: "George R.R. Martin", editorial: "Bantam Spectra", edition: "1st", pages: 973 },
        // { name: "A Feast for Crows", author: "George R.R. Martin", editorial: "Bantam Spectra", edition: "1st", pages: 753 },
        // { name: "A Dance with Dragons", author: "George R.R. Martin", editorial: "Bantam Spectra", edition: "1st", pages: 1056 }
    ];

    async function initializeBooks() {
        for (const book of initialBooks) {
            try {
                console.log("Book being added:", book);

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify(book)
                });

                if (response.ok) {
                    console.log(`Successfully added: ${book.name}`);
                } else {
                    const errorDetails = await response.text();
                    console.error(`Failed to add: ${book.name}, Status: ${response.status}, Details: ${errorDetails}`);
                }
            } catch (error) {
                console.error(`Error adding book ${book.name}:`, error);
            }
        }
    }

    await initializeBooks();
})();
