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
// public_users.get('/review/:isbn',function (req, res) {
//   const isbn = req.params.isbn;

//   const book = books[isbn];

//   if (book && book.reviews) {
//       res.json({ isbn: isbn, reviews: book.reviews });
//   } else {
//       res.status(404).json({ message: 'Reviews not found for this book' });
//   }
//   return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.put('/auth/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const { review } = req.query;
    const username = req.session.username;
  
    if (!username) {
      return res.status(401).json({ message: "You must be logged in to post a review" });
    }
  
    const book = books[isbn];
  
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
  
    if (!review) {
      return res.status(400).json({ message: "Review content is required" });
    }
  
    if (book.reviews) {
      const existingReviewIndex = book.reviews.findIndex(r => r.username === username);
  
      if (existingReviewIndex !== -1) {
        book.reviews[existingReviewIndex].review = review;
      } else {
        book.reviews.push({ username, review });
      }
    } else {
      book.reviews = [{ username, review }];
    }
  
    return res.status(200).json({ message: "Review added/updated successfully", reviews: book.reviews });
  });


  TESTING
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;
  
    if (!username) {
      return res.status(401).json({ message: "You must be logged in to delete a review" });
    }
  
    const book = books[isbn];
  
    if (!book || !book.reviews) {
      return res.status(404).json({ message: "No reviews found for this book" });
    }
  
    const reviewIndex = book.reviews.findIndex(r => r.username === username);
  
    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Review not found for this user" });
    }
  
    book.reviews.splice(reviewIndex, 1);
  
    return res.status(200).json({ message: "Review deleted successfully", reviews: book.reviews });
  });
  


  const axios = require('axios');

  const getBooks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/books'); // Replace with your actual endpoint URL
      return response.data;
    } catch (error) {
      console.error("Error fetching books:", error);
      return { message: "Error fetching books." };
    }
  };
  
  // Assuming you want to call this function and print the books
  getBooks().then(books => {
    console.log("Books available:", books);
  }).catch(error => {
    console.error("Error:", error);
  });
  

  const axios = require('axios');

  // Function to get book details based on ISBN
  const getBookByISBN = async (isbn) => {
    try {
      const response = await axios.get(`http://localhost:5000/book/${isbn}`); // Replace with your actual endpoint
      return response.data; // Assuming the server returns book details in the response
    } catch (error) {
      console.error("Error fetching book by ISBN:", error);
      return { message: "Error fetching book details." };
    }
  };
  
  // Example usage: Fetching a book by ISBN
  getBookByISBN('978-3-16-148410-0').then(book => {
    console.log("Book details:", book);
  }).catch(error => {
    console.error("Error:", error);
  });
  
  


  const axios = require('axios');

// Function to get books by author
const getBooksByAuthor = (author) => {
  axios.get(`http://localhost:5000/author/${author}`)  // Replace with your actual endpoint
    .then(response => {
      console.log("Books by author:", response.data); // Assuming the server returns a list of books by the author
    })
    .catch(error => {
      console.error("Error fetching books by author:", error);
    });
};

// Example usage: Fetching books by an author
getBooksByAuthor('Chinua Achebe');


const axios = require('axios');

// Function to get books by title
const getBooksByTitle = async (title) => {
  try {
    const response = await axios.get(`http://localhost:5000/title/${title}`); // Replace with your actual endpoint
    return response.data; // Assuming the server returns book details based on the title
  } catch (error) {
    console.error("Error fetching books by title:", error);
    return { message: "Error fetching books by title." };
  }
};

// Example usage: Fetching books by title
getBooksByTitle('Things Fall Apart').then(book => {
  console.log("Book details by title:", book);
}).catch(error => {
  console.error("Error:", error);
});





module.exports.general = public_users;
