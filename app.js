//jshint esversion:6

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = 3000;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
    name: "Welcome to your todoList"
});

const item2 = new Item({
    name: "Press + to add new item"
});

const item3 = new Item({
    name: "Check the checkbox to delete new item"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
    name: String,
    items: [itemSchema]
}

const List = mongoose.model("List",listSchema);



app.get('/', function (req, res) {

    Item.find({}, function (err, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            });
        }
        else {
            res.render('list', {
                listTitle: "Today",
                newListItems: foundItems
            });
        }
    });
});

app.get('/work', function (req, res) {
    res.render('list', {
        listTitle: "Work List",
        newListItems: workItems
    });
});

app.post("/delete",function (req,res) {
    const checkedItem = req.body.checkbox;
    const listName = req.body.listName;

    if(listName === "Today"){
        Item.findByIdAndRemove(checkedItem,function (err) {
            if(err){
                console.log(err);
            }
            res.redirect("/");
        });
    }
    else{
        List.findOneAndUpdate({name:listName},{$pull:{items:{_id:checkedItem}}},function (err,foundList) {
            if(!err){
                res.redirect("/" + `${listName}`)
            }
        })
    }

    
});

app.get("/:newRoute",function (req,res) {
    const customListName = req.params.newRoute;

    List.findOne({name:customListName},function (err,results) {
        if(!err){
            if(!results){
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
            
                list.save();
                res.redirect('/'+ `${customListName}`)
            }
            else{
                res.render('list',{
                    listTitle: customListName,
                    newListItems: results.items
                })
            }
        }else{
            console.log(err);
        }
    });
});

app.post('/', function (req, res) {
    const itemName = req.body.item;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if(listName === "Today"){    
        item.save();
        res.redirect('/');
    }else{
        List.findOne({name:listName},function (err,foundList) {
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        })
    }
});

app.listen(port, function () {
    console.log(`Server is up and running on ${port}`);
});