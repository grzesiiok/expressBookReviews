const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({
        message: 'Username and password are required'
      });
    }
  
    const userExists = users.some(user => user.username === username);
    if (userExists) {
      return res.status(400).json({
        message: 'Username already exists'
      });
    }
  
    users.push({ username, password });
  
    return res.status(201).json({
      message: 'User registered successfully',
      user: { username }
    });
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.json({ books });
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
      res.json({ isbn, ...book });
  } else {
      res.status(404).json({ message: "Book not found" });
  }
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
    let booksByAuthor = [];

    for (let key in books) {
        if (books[key].author === author) {
            booksByAuthor.push(books[key]);
        }
    }

    if (booksByAuthor.length > 0) {
        res.json(booksByAuthor);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title; 
  let foundBooks = [];

  for (let key in books) {
      let book = books[key];
      if (book.title.toLowerCase() === title.toLowerCase()) {
          foundBooks.push(book);  
      }
  }

  if (foundBooks.length > 0) {
      res.json(foundBooks);
  } else {
      res.status(404).json({ message: 'Book not found' });
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if (book && book.reviews) {
      res.json({ isbn: isbn, reviews: book.reviews });
  } else {
      res.status(404).json({ message: 'Reviews not found for this book' });
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
