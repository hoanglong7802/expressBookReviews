const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    const user = users.find((user) => user[0] === username);
    return !!user;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.find((user) => user[0] === username && user[1] === password);
    return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  console.log(users);
  console.log(username);
  console.log(password);
  if (!username || !password) {
      return res.status(400).json({error: "Username and password are required"});
  }

  if (!isValid(username)) {
      return res.status(401).json({ message: "Invalid username" });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid user" });
  }
  const token = jwt.sign({username}, "secretKey");
  res.cookie("token", token, {httpOnly: true});

  return res.status(200).json({ message: "Authentication successful" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const username = req.session.user;
  const isbn = req.params.isbn;
  const review = req.body.review;

  // Check if the book exists
  if (books.hasOwnProperty(isbn)) {
    // Check if the user has already reviewed the book
    if (books[isbn].reviews.hasOwnProperty(username)) {
      // Update the review
      books[isbn].reviews[username] = review;
      res.status(200).json({ message: 'Review updated successfully' });
    } else {
        books[isbn].reviews[username] = { review: review };
        res.status(200).json({ message: 'Review added successfully' });
    }
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
    const username = req.session.user;
    const isbn = req.params.isbn;
  
    // Check if the book exists
    if (books.hasOwnProperty(isbn)) {
      // Check if the user has reviewed the book
      if (books[isbn].reviews.hasOwnProperty(username)) {
        // Delete the user's review
        delete books[isbn].reviews[username];
        res.status(200).json({ message: 'Review deleted successfully' });
      } else {
        res.status(404).json({ message: 'User has not reviewed this book' });
      }
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  });
  

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
