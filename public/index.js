#!/usr/bin/nodejs

// -------------- load packages -------------- //
// INITIALIZATION STUFF

var express = require('express')
var app = express();
var https = require('https');

// WEB SOCKET

tempFromRPi = 0

const expressWs = require('express-ws')(app);

app.ws('/', function(ws, req) {
    console.log('WEB SOCKET: Connection from web site!!');
});

app.ws('/raspberrypi', function(ws, req) {
    console.log('WEB SOCKET: Connection from Raspberry Pi!!');
    
    // SENDING MESSAGE TO RPI
    ws.send(`hello`);
    
    // RECEIVING MESSAGE FROM RPI
    ws.on('message', function(msg) {
        tempFromRPi = msg
        console.log(`Message from RaspberryPi: ${msg}`);
        
    });
});

// END WEB SOCKET

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine','ejs')

app.use(express.static('static'))

app.get('/', function (req, res) {
//   res.send('Hello World')
    var options = { 
    	headers : {
    		'User-Agent': 'weather?'
    	}
    }
    https.get('https://api.weather.gov/gridpoints/LWX/92,67/forecast/hourly', options, function(response) {
        var rawData2 = '';
        response.on('data', function(chunk) {
          rawData2 += chunk;
        });
        response.on('end', function() {
          console.log("done with json pull #3")
          var processed_raw_data2 = JSON.parse(rawData2);
          if(processed_raw_data2.type != "Feature") {
              let errorUrl = "https://user.tjhsst.edu/2024apolinen/weather/form?error=proper+coordinates,+but+unavailable+weather&lat=" + res.locals.lat + "&long=" +res.locals.long;
              res.redirect(errorUrl);
          }
          try {
              console.log("processed_raw_data2.properties.elevation" + processed_raw_data2.properties.elevation)
              var obj = {
                  hourly: processed_raw_data2.properties.periods,
                  temp: tempFromRPi,
                  date: "",
                  dailyStart: 0,
              };
          } catch (error) {
              res.redirect("https://user.tjhsst.edu/2024apolinen/weather/form?error=something+really+bad+went+wrong");
              return;
          }
              
          
          var today = new Date();
          var dd = String(today.getDate()).padStart(2, '0');
          var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
          var yyyy = today.getFullYear();
          obj.date = mm + '/' + dd + '/' + yyyy;
          
          obj.waterDepth = Math.floor(Math.random() * 100); 
          
          console.log("--------------"); 
          res.render('home', obj);
        });

    }).on('error', function(e) {
        console.error(e);
    });


    //  res.render('home')
})

app.get('/update', function (req, res) {
    if("temp" in req.query) {
        var tempIn = req.query.temp;
        console.log(`temp is ${tempIn}`)
        tempFromRPi = tempIn
    }
   res.send('Hello World')
})

app.get('/on', function (req, res) {
   console.log("im turning on")
   res.send('turning on')
})

app.get('/off', function (req, res) {
    console.log("im turning off")
   res.send('turning off')
})


// -------------- listener -------------- //
// // The listener is what keeps node 'alive.' 

var listener = app.listen(process.env.PORT || 8080, process.env.HOST || "0.0.0.0", function() {
    console.log("EXPRESS IS WORKING WAHOOO!!! :D");
});