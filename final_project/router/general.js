const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;

  if (!username || !password) {
      return res.status(400).json({error: "Username or password required"});
  } 

  if (users.find(user => user.username === username)){
        return res.status(409).json({error:"Username already exists"});
  }
  const newUser = [username, password];
  users.push(newUser);
  return res.json({message: "Username registered successfully"});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      const ans = await books;
      return res.status(200).json(ans);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = await books[isbn];
  let ans = {error: "Books not found"};
  if (book){
      return res.json(book);
  }
  else {
        return res.status(404).json(ans);
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
  //Write your code here
  const author = req.params.author;
  const bookKeys = Object.keys(books);

  const matchedBooks = await bookKeys.reduce((ans, key) => {
    if (books[key].author === author){
        ans[key] = books[key];
    }
    return ans;
  }, {});
  if (Object.keys(matchedBooks).length > 0) {
      res.json(matchedBooks);
  } 
  else {
      res.status(404).json({error: "Books not found"});
  }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
  //Write your code here
  const title = req.params.title;
  const bookKeys = Object.keys(books);

  const matchedBooks = await bookKeys.reduce((ans, key) => {
    if (books[key].title === title){
        ans[key] = books[key];
    }
    return ans;
  }, {});
  if (Object.keys(matchedBooks).length > 0) {
      res.json(matchedBooks);
  } 
  else {
      res.status(404).json({error: "Books not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const bookKeys = Object.keys(books);

  const matchedBooks = bookKeys.reduce((ans, key) => {
    if (key === isbn){
        ans[isbn] = books[key].reviews;
    }
    return ans;
  }, {});
  if (Object.keys(matchedBooks).length > 0) {
      res.json(matchedBooks);
  } 
  else {
      res.status(404).json({error: "Books not found"});
  }
});

module.exports.general = public_users;
