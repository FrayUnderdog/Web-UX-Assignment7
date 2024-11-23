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

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        const items = Array.isArray(result.items) ? result.items : [];
        const itemsList = document.getElementById('itemsList');
        itemsList.innerHTML = '';

        items.forEach(item => {
            const listItem = document.createElement('li');

            // Add book name as a link
            const bookLink = document.createElement('a');
            bookLink.href = `item.html?id=${encodeURIComponent(item.id)}`;
            bookLink.textContent = item.name;

            // Add buttons container
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('button-container');

            // Edit button
            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.onclick = () => editItem(item.id);

            // Delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = () => deleteItem(item.id);

            buttonContainer.appendChild(editButton);
            buttonContainer.appendChild(deleteButton);

            listItem.appendChild(bookLink);
            listItem.appendChild(buttonContainer);
            itemsList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error loading items:', error.message);
        document.getElementById('itemsList').innerHTML = '<li>Failed to load items. Please try again later.</li>';
    }
}

function editItem(id) {
    window.location.href = `edit.html?id=${id}`;
}

// Handle deleting an item
async function deleteItem(id) {
    const confirmDelete = confirm('Are you sure you want to delete this book?');
    if (!confirmDelete) return;

    try {
        const response = await fetch(`${apiUrl}/items/${id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error(`Failed to delete item with ID ${id}. Status: ${response.status}`);

        alert('Book deleted successfully!');
        loadItems(); // Refresh the list after deletion
    } catch (error) {
        console.error('Error deleting item:', error.message);
        alert('Failed to delete the book. Please try again.');
    }
}

// Validate Editorial field (only English letters)
function validateEditorial(editorial) {
    const regex = /^[A-Za-z\s]+$/; // Only letters and spaces
    return regex.test(editorial);
}

// Handle form submission to create a new book
async function createItem(event) {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const author = document.getElementById('author').value.trim();
    const editorial = document.getElementById('editorial').value.trim();
    const edition = document.getElementById('edition').value.trim();
    const pages = parseInt(document.getElementById('pages').value, 10);

    // Reset error messages
    const editorialError = document.getElementById('editorialError');
    editorialError.textContent = '';

    // Validate fields
    if (!validateEditorial(editorial)) {
        editorialError.textContent = 'Editorial must only contain English letters.';
        return; // Stop form submission
    }

    const newItem = { name, author, editorial, edition, pages };

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

// Fetch and display details of a single item
async function loadItemDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = parseInt(urlParams.get('id'), 10);

        if (!itemId) throw new Error("Item ID is missing or invalid in the URL.");

        const response = await fetch(`${apiUrl}/items`, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();
        const item = result.items.find(book => book.id === itemId);
        if (!item) throw new Error(`No book found with ID: ${itemId}`);

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

// Load edit form with book data and handle form submission for editing
async function loadEditItem() {
    const urlParams = new URLSearchParams(window.location.search);
    const itemId = urlParams.get('id');

    if (!itemId) {
        alert('No item ID provided.');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/items/${itemId}`, {
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) throw new Error(`Failed to fetch item with ID ${itemId}`);

        const item = await response.json();
        document.getElementById('name').value = item.name;
        document.getElementById('author').value = item.author;
        document.getElementById('editorial').value = item.editorial;
        document.getElementById('edition').value = item.edition;
        document.getElementById('pages').value = item.pages;

        const form = document.getElementById('editForm');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const updatedItem = {
                name: document.getElementById('name').value,
                author: document.getElementById('author').value,
                editorial: document.getElementById('editorial').value,
                edition: document.getElementById('edition').value,
                pages: parseInt(document.getElementById('pages').value, 10),
            };

            try {
                const updateResponse = await fetch(`${apiUrl}/items/${itemId}`, {
                    method: 'PUT',
                    headers: {
                        "Authorization": `Bearer ${apiKey}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(updatedItem)
                });

                if (!updateResponse.ok) throw new Error('Failed to update item');

                alert('Book updated successfully!');
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Error updating item:', error.message);
                alert('Failed to save changes.');
            }
        });
    } catch (error) {
        console.error('Error loading item for editing:', error.message);
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
    } else if (path.endsWith('edit.html')) {
        loadEditItem();
    }
});
