//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const date = require(__dirname + "/date.js");
const app = express();

// const items = [`buy food`, `cook food`, `eat food`];
// const workItems = [];

// --------------------------------------------------
// setting up mongoose
const mongoose = require("mongoose");
const url = "mongodb://localhost:27017/todolistDB";
mongoose.connect(url, { useNewUrlParser: true });

// schema
const itemsSchema = {
  name: {
    type: String,
  },
};

// model
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: `welcome to your todolist`,
});

const item2 = new Item({
  name: `hit + to add new item`,
});
const item3 = new Item({
  name: `<-------hit this to delete an item`,
});

const defaultItems = [item1, item2, item3];

// routing param schema
const listSchema = {
  name: String,
  items: [itemsSchema],
};
// model
const List = mongoose.model("List", listSchema);

// -------------------------------------------------------------
// Set up view engine middleware for ejs
app.set("view engine", "ejs");

// middleware to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// (middleware) to be able to access your static files in public folder
app.use(express.static(`public`));

// get date

let day = date();
// GET HOME ROUTE
app.get("/", (req, res) => {
  // to check if items exists in the database
  Item.find({}, (err, foundItems) => {
    if (!err) {
      if (foundItems.length === 0) {
        Item.insertMany(defaultItems, function (err) {
          err
            ? console.log(`error ${err}`)
            : console.log("successfully added items to the database");
        });
        res.redirect("/");
      } else {
        // ejs render to views/list.ejs

        res.render("list", { listTitle: day, newListItems: foundItems });
        // mongoose.connection.close();
      }
    }
  });
});

// GET DYNAMIC ROUTES
app.get(`/:customListName`, (req, res) => {
  const listParameter = req.params.customListName;

  // find if a list already exists in the database
  List.findOne({ name: listParameter }, (err, foundList) => {
    if (!err) {
      if (!foundList) {
        // create a new list
        const list = List({
          name: listParameter,
          items: defaultItems,
        });

        list.save();
        res.redirect(`/${listParameter}`);
      } else {
        // show the existing list
        res.render(`list`, {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

// add new items
app.post(`/`, (req, res) => {
  const itemName = req.body.newItem;
  // // to check if the input tag is empty
  if (itemName === "") {
    res.redirect("/");
  } else {
    const item = new Item({
      name: itemName,
    });
    item.save();
    res.redirect("/");
  }
});

// delete item from the list
app.post(`/delete`, (req, res) => {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  // to check if the listname
  if (listName === date) {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("successfully deleted an item");
        res.redirect("/delete");
      }
    });
  } else {
    // in order to delete an item from a dynamic route list
    Item.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      (err, foundList) => {
        if (!err) {
          res.redirect(`/${listName}`);
        }
      }
    );
  }
});

// POST WORK ROUTE
// app.post`/work`,
//   (req, res) => {
//     const items = req.body.newItem;
//     // console.log(list);

//     // workItems.push(items);

//     res.redirect(`/work`);
//   };

//   GET ABOUT ROUTE
// app.get(`/about`, (req, res) => {
//   res.render(`about`);
// });

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`app is listening at port 8000`);
});
