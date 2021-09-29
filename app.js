//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));
let newItems = [];
let workItems = [];


app.get('/', function (req, res) {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options)
    res.render('list', {
        listTitle: day,
        newListItems: newItems
    });
});

app.get('/work', function (req, res) {
    res.render('list', {
        listTitle: "Work List",
        newListItems: workItems
    });
});

app.post('/work', function (req, res) {
    let newItem = req.body.item;
    workItems.push(newItem);
    res.redirect('/work');
});

app.post('/', function (req, res) {
    let newItem = req.body.item;
    if(req.body.list==="Work"){
        workItems.push(newItem);
        res.redirect('/work');
    }else{
        newItems.push(newItem);
    }
    res.redirect('/');
});

app.listen(port, function () {
    console.log(`Server is up and running on ${port}`);
});