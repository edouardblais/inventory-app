#! /usr/bin/env node

console.log('This script populates some gear and categories to the database.');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Gear = require('./models/gear')
var Category = require('./models/category')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var gearCollection = []
var categories = []

function gearCreate(name, brand, description, price, number_in_stock, category, cb) {
  var gear = new Gear({ name:name, brand: brand, description: description, price: price, number_in_stock: number_in_stock, category: category });
       
  gear.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Gear: ' + gear);
    gearCollection.push(gear)
    cb(null, gear)
  }  );
}

function categoryCreate(name, cb) {
  var category = new Category({ name: name });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}


function createCategories(cb) {
    async.series([
        function(callback) {
          categoryCreate('Ropes', callback);
        },
        function(callback) {
            categoryCreate('Harness', callback);
          },
        function(callback) {
            categoryCreate('Quickdraws', callback);
          },
        function(callback) {
            categoryCreate('Belay Devices', callback);
          },
        function(callback) {
            categoryCreate('Carabiners', callback);
          },
        function(callback) {
            categoryCreate('Accessories', callback);
          },
        ],
        // optional callback
        cb);
}


function createGear(cb) {
    async.parallel([
        function(callback) {
          gearCreate('Volta', 'Petzl', 'Ultra-light 9 mm rope for performance rock climbing', 250, 5, categories[0], callback);
        },
        function(callback) {
            gearCreate('Velocity', 'Sterling', "Sterling's flagship rope and all-rounder for use in virtually any condition", 290, 6, categories[0], callback);
          },
        function(callback) {
            gearCreate('Mosquito', 'Wild Country', "Extremely lightweight, minimalistic, high-end sport climbing harness", 120, 3, categories[1], callback);
          },
        function(callback) {
            gearCreate('Venture', 'DMM', "Lightweight performance without compromising comfort", 110, 4, categories[1], callback);
          },
        function(callback) {
            gearCreate('Hirundos', 'Petzl', "Slim and lightweight harness giving you total freedom of movement without compromising comfort", 100, 5, categories[1], callback);
          },
        function(callback) {
            gearCreate('Spirit', 'Petzl', 'Lightweight and ergonomic, the Spirit quickdraw is THE benchmark for sport climbing and working a route', 23, 50, categories[2], callback);
          },
        function(callback) {
              gearCreate('Alpha', 'DMM', "The quickdraw for sport climbers who prize easy handling and quick clipping", 26, 45, categories[2], callback);
            },
        function(callback) {
              gearCreate('Grigri', 'Petzl', "Designed for all users, the GRIGRI is a belay device with assisted blocking for belaying both in the gym and at the crag", 150, 20, categories[3], callback);
            },
        function(callback) {
              gearCreate('Pivot', 'DMM', "The Pivot belay device delivers confident belaying and effective stopping power whether used in guide mode, or belaying from the waist", 30, 12, categories[3], callback);
            },
        function(callback) {
              gearCreate('William', 'Petzl', "The triple-locking WILLIAM is a large-capacity asymmetrical carabiner made of aluminum", 28, 13, categories[4], callback);
            },
        function(callback) {
            gearCreate('Liteforge', 'Black Diamond', "The LiteForge Screwgate Carabiner is our ultra-light keylock screwgates built for light and fast missions", 21, 34, categories[4], callback);
            },
        function(callback) {
            gearCreate('Beta Stick', 'Trango', "The Beta Stick Evo features a completely redesigned head with an adjustable wire arm, allowing you to clip both solid and wire gate carabiners", 100, 3, categories[5], callback);
            },
        ],
        // optional callback
        cb);
}



async.series([
    createCategories,
    createGear
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    // All done, disconnect from database
    mongoose.connection.close();
});



