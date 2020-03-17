//jshint esversion:6

const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

const items = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb+srv://arkarhtethan:testpassword@cluster0-netvj.mongodb.net/test?retryWrites=true&w=majority/todolist", { db: { safe: false }, useNewUrlParser: true, useUnifiedTopology: true });

const itemScheme = new mongoose.Schema({
    name: String,
},
    {
        writeConcern: {
            w: 'majority',
        }
    });

const Item = mongoose.model("Item", itemScheme);

const item1 = new Item({
    name: "Welcome to your todolist!",
});


const item2 = new Item({
    name: "Hit + to add new item",
});

const item3 = new Item({
    name: "<--- Hit this to delete item",
});


app.get("/", function (req, res) {
    var today = new Date();
    var option = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    var day = today.toLocaleDateString("en-US")
    Item.find({}, function (error, foundItems) {

        if (foundItems.length === 0) {
            Item.insertMany([item1, item2, item3], function (error) {
                if (error) {
                    console.log("Error occur while adding items");
                } else {
                    console.log("Successfully added items");

                    res.redirect("/");
                }
            });

        } else {
            res.render("list", { 'kindOfDay': day, "items": foundItems });
        }
    })

});

app.post('/', function (request, response) {
    var itemName = request.body.newItem;
    const item = new Item({
        name: itemName
    });
    item.save();
    response.redirect(
        "/"
    );
})

app.post('/delete', function (request, response) {
    var itemId = request.body.checkbox;
    Item.findByIdAndRemove("" + itemId, function (error) {
        console.log(error);
        if (!error) {
            console.log("Success");
            response.redirect("/");
        }
    })
})


app.listen(3000, function () {
    console.log("Server started on port 3000.");
});
