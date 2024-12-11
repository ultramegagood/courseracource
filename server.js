// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

// Mock database
const books = [
    { isbn: '12345', title: 'Book A', author: 'Author 1', review: '' },
    { isbn: '67890', title: 'Book B', author: 'Author 2', review: '' },
];
const users = [];

// Task 1: Get the book list available in the shop
app.get('/books', (req, res) => {
    res.json(books);
});

// Task 2: Get the books based on ISBN
app.get('/books/isbn/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    book ? res.json(book) : res.status(404).send('Book not found');
});

// Task 3: Get all books by Author
app.get('/books/author/:author', (req, res) => {
    const authorBooks = books.filter(b => b.author === req.params.author);
    authorBooks.length > 0 ? res.json(authorBooks) : res.status(404).send('Books not found');
});

// Task 4: Get all books based on Title
app.get('/books/title/:title', (req, res) => {
    const titleBooks = books.filter(b => b.title === req.params.title);
    titleBooks.length > 0 ? res.json(titleBooks) : res.status(404).send('Books not found');
});

// Task 5: Get book review
app.get('/books/:isbn/review', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    book ? res.json({ review: book.review }) : res.status(404).send('Book not found');
});

// Task 6: Register new user
app.post('/users/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).send('User already exists');
    }
    users.push({ username, password });
    res.status(201).send('User registered');
});

// Task 7: Login as a registered user
app.post('/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    user ? res.send('Login successful') : res.status(401).send('Invalid credentials');
});

// Task 8: Add/Modify a book review (requires authentication)
app.put('/books/:isbn/review', (req, res) => {
    const { username, review } = req.body;
    const book = books.find(b => b.isbn === req.params.isbn);
    if (!book) return res.status(404).send('Book not found');
    book.review = `${username}: ${review}`;
    res.send('Review added/modified');
});

// Task 9: Delete book review added by the particular user
app.delete('/books/:isbn/review', (req, res) => {
    const { username } = req.body;
    const book = books.find(b => b.isbn === req.params.isbn);
    if (!book || !book.review.startsWith(`${username}:`)) {
        return res.status(404).send('Review not found or unauthorized');
    }
    book.review = '';
    res.send('Review deleted');
});

// Async/Await and Promises Methods (Tasks 10-13)

// Task 10: Get all books – Using async callback function
app.get('/async/books', async (req, res) => {
    try {
        const result = await new Promise((resolve) => resolve(books));
        res.json(result);
    } catch (error) {
        res.status(500).send('Error fetching books');
    }
});

// Task 11: Search by ISBN – Using Promises
app.get('/promise/books/isbn/:isbn', (req, res) => {
    new Promise((resolve, reject) => {
        const book = books.find(b => b.isbn === req.params.isbn);
        book ? resolve(book) : reject('Book not found');
    })
        .then(book => res.json(book))
        .catch(err => res.status(404).send(err));
});

// Task 12: Search by Author
app.get('/promise/books/author/:author', (req, res) => {
    new Promise((resolve, reject) => {
        const authorBooks = books.filter(b => b.author === req.params.author);
        authorBooks.length > 0 ? resolve(authorBooks) : reject('Books not found');
    })
        .then(authorBooks => res.json(authorBooks))
        .catch(err => res.status(404).send(err));
});

// Task 13: Search by Title
app.get('/promise/books/title/:title', (req, res) => {
    new Promise((resolve, reject) => {
        const titleBooks = books.filter(b => b.title === req.params.title);
        titleBooks.length > 0 ? resolve(titleBooks) : reject('Books not found');
    })
        .then(titleBooks => res.json(titleBooks))
        .catch(err => res.status(404).send(err));
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
