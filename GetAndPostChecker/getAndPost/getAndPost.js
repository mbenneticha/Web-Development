//middleware
//express
var express = require('express');
var app = express();

//body-parser
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//express handlebars && other
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3050);

//GET Request
app.get('/',function(req,res){
  var context = {};
  var getReq = [];
  for (var p in req.query){
    getReq.push({'name':p,'value':req.query[p]})
  }
  context.qParams = getReq;
  context.type = "GET";
  res.render('getAndPost', context);
});

//POST Request
app.post('/',function(req,res){
	var context = {};
	var postReq = [];
	for (var p in req.body){
		postReq.push({'name': p, 'value': req.body[p]});
	}

	var queryReq = [];
	for (var p in req.query){
		queryReq.push({'name': p, 'value': req.query[p]});
	}

	context.pParams = postReq;
	context.qParams = queryReq;
	context.type = "POST";
  	res.render('getAndPost', context);
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});