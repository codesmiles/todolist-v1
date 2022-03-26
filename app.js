//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const path = require("path");

const app = express();

const items = [`buy food`, `cook food`, `eat food`];
const workItems = [];
// Set up view engine middleware for ejs
app.set("view engine", "ejs");

// middleware to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// (middleware) to be able to access your static files in public folder
app.use(express.static(`public`));

// GET HOME ROUTE
app.get("/", (req, res) => {
  // res.sendFile(path.join(__dirname, 'index.html'));

  const date = new Date();
  const getday = date.getDay();

  // date method to get the day of the week cleanly
  let options = {
    weekday: `long`,
    day: `numeric`,
    month: `long`,
  };

  let day = date.toLocaleDateString("en-US", options);

  // ejs render to views/list.ejs
  res.render("list", { listTitle: day, newListItems: items });
});

// POST HOME ROUTE
app.post(`/`, (req, res) => {
  const list = req.body.newItem;

  if (req.body.list === `Work List`) {
    workItems.push(list);
    res.redirect(`/work`);
  } else {
    items.push(list);
    res.redirect(`/`);
  }
});

// GET WORK ROUTE
app.get(`/work`, (req, res) => {
  res.render(`list`, { listTitle: `Work List`, newListItems: workItems });
});

app.post`/work`,
  (req, res) => {
    const items = req.body.newItem;
    // console.log(list);

    workItems.push(items);

    res.redirect(`/work`);
  };

app.listen(8000, () => {
  console.log(`app is listening at port 8000`);
});
