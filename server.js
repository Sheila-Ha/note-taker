// Import Express.js
const express = require("express");
// Import built-in Node.js package 'path' to resolve path of files that are located on the server
const path = require("path");
const fs = require("fs");
// 128 bit unique identifier used to identify data entities in computer systems
const { v4: uuidv4 } = require("uuid");

//Initialize an instance of Express.js
const app = express();
//Specify on which port the Express.js server will run
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Static middleware pointing to the public folder
app.use(express.static("public"));

app.get('/notes',(req, res) => {
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});

app.get("/api/notes", (req, res) => {
  //console.log('api/notes');
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    res.json(JSON.parse(data));
  });
});
// Create Express.js routes for default "*"
// Put this AFTER other gets. Has to be the last get because it is a fallback if other match is not found.
app.get("*", (req, res) => {
  //console.log(req);
  //console.log(res);
  //console.log('test - *');
  res.status(200).sendFile(path.join(__dirname, "/public/index.html"));
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuidv4();

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    // Output the data for testing
    console.log(data);
    // Convert the data from a string to an object
    let notes = JSON.parse(data);
    // Push the new data onto the notes object
    console.log("Push the data onto the notes");
    notes.push(newNote);
    // Output the notes object for testing
    console.log(notes);
    fs.writeFile("./db/db.json", JSON.stringify(notes, null, 2), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

// call deleteNote
app.delete("/api/notes/*", (req, res) => {
  //console.log('api/notes');
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;
    let notes = JSON.parse(data);
    console.log(notes);
  });
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
