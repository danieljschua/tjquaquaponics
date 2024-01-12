#!/usr/bin/nodejs

// -------------- load packages -------------- //
// INITIALIZATION STUFF

var express = require('express')
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine','ejs')

app.use(express.static('static'))


app.get('/', function (req, res) {
//   res.send('Hello World')
     res.render('home')
})



// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("Express server started");
});