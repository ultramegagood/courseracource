
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
 
const books = [
    { isbn: '12345', title: 'Book A', author: 'Author 1', review: '' },
    { isbn: '67890', title: 'Book B', author: 'Author 2', review: '' },
];
const users = [
    
];


app.get('/books', (req, res) => {
    res.json(books);
});


app.get('/books/isbn/:isbn', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    book ? res.json(book) : res.status(404).send('Book not found');
});


app.get('/books/author/:author', (req, res) => {
    const authorBooks = books.filter(b => b.author === req.params.author);
    authorBooks.length > 0 ? res.json(authorBooks) : res.status(404).send('Books not found');
});


app.get('/books/title/:title', (req, res) => {
    const titleBooks = books.filter(b => b.title === req.params.title);
    titleBooks.length > 0 ? res.json(titleBooks) : res.status(404).send('Books not found');
});


app.get('/books/:isbn/review', (req, res) => {
    const book = books.find(b => b.isbn === req.params.isbn);
    book ? res.json({ review: book.review }) : res.status(404).send('Book not found');
});


app.post('/users/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).send('User already exists');
    }
    users.push({ username, password });
    res.status(201).send('User registered');
});


app.post('/users/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    user ? res.send('Login successful') : res.status(401).send('Invalid credentials');
});

app.put('/books/:isbn/review', (req, res) => {
    const { username, review } = req.body;
    const book = books.find(b => b.isbn === req.params.isbn);
    if (!book) return res.status(404).send('Book not found');
    book.review = `${username}: ${review}`;
    res.send('Review added/modified');
});


app.delete('/books/:isbn/review', (req, res) => {
    const { username } = req.body;
    const book = books.find(b => b.isbn === req.params.isbn);
    if (!book || !book.review.startsWith(`${username}:`)) {
        return res.status(404).send('Review not found or unauthorized');
    }
    book.review = '';
    res.send('Review deleted');
});
 
app.get('/async/books', async (req, res) => {
    try {
        const result = await new Promise((resolve) => resolve(books));
        res.json(result);
    } catch (error) {
        res.status(500).send('Error fetching books');
    }
}); 
app.get('/promise/books/isbn/:isbn', (req, res) => {
    new Promise((resolve, reject) => {
        const book = books.find(b => b.isbn === req.params.isbn);
        book ? resolve(book) : reject('Book not found');
    })
        .then(book => res.json(book))
        .catch(err => res.status(404).send(err));
}); 
app.get('/promise/books/author/:author', (req, res) => {
    new Promise((resolve, reject) => {
        const authorBooks = books.filter(b => b.author === req.params.author);
        authorBooks.length > 0 ? resolve(authorBooks) : reject('Books not found');
    })
        .then(authorBooks => res.json(authorBooks))
        .catch(err => res.status(404).send(err));
});
 
app.get('/promise/books/title/:title', (req, res) => {
    new Promise((resolve, reject) => {
        const titleBooks = books.filter(b => b.title === req.params.title);
        titleBooks.length > 0 ? resolve(titleBooks) : reject('Books not found');
    })
        .then(titleBooks => res.json(titleBooks))
        .catch(err => res.status(404).send(err));
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
