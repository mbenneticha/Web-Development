var express = require('express');
var app = express();

var handlebars = require('express-handlebars').create({defaultLayout:'main'});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3080);


app.use(express.static(__dirname + '/public'));



app.get('/',function(req,res){
  res.render('home');
});

app.get('/start',function(req,res){
  res.render('start');
});

app.get('/showInfo',function(req,res){
  res.render('showInfo');
});

app.get('/episodeList',function(req,res){
  res.render('episodeList');
});

app.get('/extra',function(req,res){
  res.render('extra');
});

app.get('/pretty',function(req,res){
  res.render('pretty');
});

app.get('/conclude',function(req,res){
  res.render('conclude');
});




/*route handler for 404 errors */
app.use(function(req,res){
  res.status(404);
  res.render('404');
});


/*route handler for 500 errors */
app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});


app.listen(app.get('port'), function(){
  console.log('Express started on http://52.25.91.135:' + app.get('port') + '; press Ctrl-C to terminate.');
});