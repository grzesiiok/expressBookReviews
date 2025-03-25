const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const secretKey = 'your-secret-key';

const isValid = (username) => {
  return !users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  const user = users.find(user => user.username === username && user.password === password);
  return user ? true : false;
};

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!authenticatedUser(username, password)) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
  req.session.token = token;

  res.status(200).json({
    message: 'Login successful',
    token: token,
  });
});

regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.body;
  const { token } = req.session;

  if (!token) {
    return res.status(401).json({ message: "You must be logged in to add a review" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    const username = decoded.username;

    const book = books.find(book => book.isbn === isbn);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.reviews) {
      book.reviews = [];
    }

    book.reviews.push({ username, review });

    return res.status(200).json({ message: "Review added successfully", reviews: book.reviews });
  } catch (error) {
    return res.status(401).json({ message: "Invalid token, please log in again" });
  }
});

regd_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  if (!isValid(username)) {
    return res.status(400).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  return res.status(201).json({ message: "User registered successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
