// API configuration
const apiUrl = "https://raybool.free.beeceptor.com";
const apiKey = "P_Bu9kZR316qwU6IOmJUvXZJQmP6sCNgk9gjBVaBBgXjE2jh3w";

// Fetch and display items on the homepage
async function loadItems() {
    try {
        const response = await fetch(`${apiUrl}/items`, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("API response:", result);

        const items = Array.isArray(result.items) ? result.items : [];
        if (!Array.isArray(items)) {
            throw new Error("Error: Items fetched is not an array.");
        }

        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = '';

        if (items.length === 0) {
            itemsList.innerHTML = '<li>No items found.</li>';
            return;
        }

        items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <a href="item.html?id=${encodeURIComponent(item.id)}">
                    <strong>${item.name}</strong>
                </a>
            `;
            itemsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading items:', error.message);
        document.getElementById('itemsList').innerHTML = '<li>Failed to load items. Please try again later.</li>';
    }
}

// Fetch and display details of a single item
async function loadItemDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = parseInt(urlParams.get('id'), 10); // Get and parse the id parameter

        if (!itemId) {
            throw new Error("Item ID is missing or invalid in the URL.");
        }

        const response = await fetch(`${apiUrl}/items`, { // Request all books
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Item details from API:", result);

        // Find the matching book from the returned array
        const item = result.items.find(book => book.id === itemId);
        if (!item) {
            throw new Error(`No book found with ID: ${itemId}`);
        }

        // Render the book details
        const itemDetails = document.getElementById('itemDetails');
        itemDetails.innerHTML = `
            <p><strong>Name:</strong> ${item.name}</p>
            <p><strong>Author:</strong> ${item.author}</p>
            <p><strong>Editorial:</strong> ${item.editorial}</p>
            <p><strong>Edition:</strong> ${item.edition}</p>
            <p><strong>Pages:</strong> ${item.pages}</p>
        `;
    } catch (error) {
        console.error('Error loading item details:', error.message);
        const itemDetails = document.getElementById('itemDetails');
        itemDetails.innerHTML = '<p>Failed to load item details. Please try again later.</p>';
    }
}

// Handle form submission to create a new book
async function createItem(event) {
    event.preventDefault();

    const newItem = {
        name: document.getElementById('name').value,
        author: document.getElementById('author').value,
        editorial: document.getElementById('editorial').value,
        edition: document.getElementById('edition').value,
        pages: parseInt(document.getElementById('pages').value, 10)
    };

    console.log("Submitting new item:", newItem);

    try {
        const response = await fetch(`${apiUrl}/items`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newItem)
        });

        if (!response.ok) {
            const errorDetails = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorDetails}`);
        }

        alert('Book created successfully!');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error creating item:', error.message);
        alert('Failed to create book. Please try again later.');
    }
}

// Add event listeners to call corresponding logic based on page functionality
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.endsWith('index.html')) {
        loadItems();
    } else if (path.endsWith('item.html')) {
        loadItemDetails();
    } else if (path.endsWith('create.html')) {
        const form = document.getElementById('createForm');
        if (form) {
            form.addEventListener('submit', createItem);
        } else {
            console.error("Form not found on create.html");
        }
    }
});
