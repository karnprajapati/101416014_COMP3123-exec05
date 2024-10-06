const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const router = express.Router();

// Middleware to parse JSON body
app.use(express.json());

/*
- Create new html file named home.html 
- Add <h1> tag with the message "Welcome to ExpressJs Tutorial"
- Return home.html page to the client
*/
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

/*
- Return all details from user.json file to client in JSON format
*/
router.get('/profile', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ status: false, message: 'Error reading user data' });
    }
    const users = JSON.parse(data);
    res.json(users);
  });
});

/*
- Modify /login router to accept username and password as JSON body parameters
- Read data from user.json file and validate credentials
*/
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ status: false, message: 'Error reading user data' });
    }

    const users = JSON.parse(data);
    const user = users.find(user => user.username === username);

    if (!user) {
      return res.json({ status: false, message: 'User Name is invalid' });
    }

    if (user.password !== password) {
      return res.json({ status: false, message: 'Password is invalid' });
    }

    res.json({ status: true, message: 'User Is valid' });
  });
});

/*
- Modify /logout route to accept username as a parameter and display a message in HTML format
*/
router.get('/logout/:username', (req, res) => {
  const { username } = req.params;
  res.send(`<b>${username} successfully logged out.<b>`);
});

/*
- Add error handling middleware to return a 500 page with the message "Server Error"
*/
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('<h1>Server Error</h1>');
});

// Use the router
app.use('/', router);

// Start the server
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Web Server is listening at port ${port}`);
});
