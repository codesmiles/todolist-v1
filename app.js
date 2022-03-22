//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();

app.set("view engine", "ejs");

// middleware to use bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// (middleware) to be able to access ayour static folder
app.use(express.static(`public`)); 

// HOME ROUTE
app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/index.html');

    const date = new Date();
    const getday = date.getDay();
    day = "";
    
    switch (getday) { 
        case 0: day = `Sunday`;
            break;
        case 1: day = `Monday`;
            break;
        case 2: day = `Tuesday`;
            break;
        case 3: day = `Wednesday`;
            break;
        case 4: day = `Thursday`;
            break;
        case 5: day = `Friday`;
            break;
        case 6: day = `Saturday`;
            break;
        default: day = `the day is not found`;
    }
    // if (getday === 0 || getday === 6) { 
    //     `${day} - it's weekend`;
    //     // res.render("list", { kindOfDay: day });
    //     // res.send(`<h1>its the weekend yall</h1>`);
        

    // }
    // else {
    //     `${day} - it's weekday`;
       
    //     // res.send(`<h1>its the weekday</h1>`);
    // }
    
    res.render("list", { kindOfDay: day });
});

app.get(`/about`, (req, res) => {

    res.send(`<h1>About Page</h1>`);
});



app.listen(8000,()=>{
    console.log(`app is listening at port 8000`)
})
