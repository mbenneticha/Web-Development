/**************************************
 * Author: Mariam Ben-Neticha
 * Date Completed: 02/29/2016
 * Program: Database UI Interactions
****************************************/
"use strict";

var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var handlebars = require('express-handlebars').create({
    defaultLayout:'main',
    helpers: {
        section: function(name, options){
            if(!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        }
    }
});

var session = require('express-session');
app.use(session({secret:'IWillNeverTell'}));

var mysql = require('mysql');
var pool = mysql.createPool({
  host  : 'localhost',
  user  : 'student',
  password: 'default',
  database: 'student'
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3030); // defaults to 3030 if env.port not set
app.use(express.static(__dirname + '/public')); // tells express where to go for public static content like css, js, imgs, etc


app.get('/', function(req, res){
    var context = {};
    pool.query('SELECT * FROM workouts', function(err, rows, fields){
        context.results = JSON.stringify(rows);
        res.render('home', context);
        console.log(context.results);
    });   
});

app.get('/load-data', function(req, res){
  var allRows = {};
    pool.query('SELECT * FROM workouts', function(err, rows, fields){
        allRows = JSON.stringify(rows);
        console.log(allRows);
        res.json(allRows);
    });  
});

app.get('/edit-by-id', function(req, res){
    var context = {};
    pool.query('SELECT * FROM workouts WHERE id=?', [req.query.id], function(err, rows, fields){

        context.results = rows[0];
        var date = JSON.stringify(rows);
        date = JSON.parse(date);
        date = date[0];
        date = date["date"];
        date = date.slice(0, 10);
        context.date = date;
        console.log(context.results);
        console.log(context.date);
        res.render('edit', context);
    });  
});

app.get('/insert',function(req,res,next){
  var allRows = {};
  pool.query("INSERT INTO workouts (`name`, `reps`, `weight`, `date`, `lbs`) VALUES (?, ?, ?, ?, ?)", [req.query.name, req.query.reps, req.query.weight, req.query.date, req.query.lbs], function(err, result){

    pool.query('SELECT * FROM workouts', function(err, rows, fields){

        allRows = JSON.stringify(rows);
        console.log(allRows);
        res.json(allRows);
    });   
  });
});


app.get('/delete', function(req, res, next) {
    var allRows = {};
    pool.query("DELETE FROM workouts WHERE id = ?", [req.query.id], function(err, result) {

        pool.query('SELECT * FROM workouts', function(err, rows, fields){

            allRows = JSON.stringify(rows);
            console.log(allRows);
            res.json(allRows);
        });   
    });
});

app.get('/edit-safe', function(req, res, next) {
    var allRows = {};
    pool.query("SELECT * FROM workouts WHERE id=?", [req.query.id], function(err, result){

        if (result.length == 1) {
            var curVals = result[0];
            pool.query("UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id = ?", 
                       [req.query.name || curVals.name, req.query.reps || curVals.reps, req.query.weight || curVals.weight, req.query.date || curVals.date, req.query.lbs || curVals.lbs, req.query.id], 
            function(err, result) {
             
                pool.query('SELECT * FROM workouts', function(err, rows, fields){
                    
                    allRows = JSON.stringify(rows);
                    console.log(allRows);
                    res.json(allRows);
                });   
            });
        }
    });
});


app.get('/reset-table',function(req,res,next){
    var context = {};
    pool.query("DROP TABLE IF EXISTS workouts", function(err){ 
        var createString = "CREATE TABLE workouts("+
            "id INT PRIMARY KEY AUTO_INCREMENT,"+
            "name VARCHAR(255) NOT NULL,"+
            "reps INT,"+
            "weight INT,"+
            "date DATE,"+
            "lbs BOOLEAN)";
        pool.query(createString, function(err){
          context.results = "Table reset";
          res.render('home',context);
        })
    });
});


app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});


app.listen(app.get('port'), function(){
  console.log('Express started on http://52.25.91.135:' + 
              app.get('port') + 
              '; press Ctrl-C to terminate.' );
});