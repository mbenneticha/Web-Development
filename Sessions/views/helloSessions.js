var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
var session = require('express-session');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({secret:'MySuperSecretPassword'}));

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 3100);

app.get('/count', function(req, res){
	var context = {};
	context.count = req.session.count || 0;
	req.session.count = context.count + 1;
	res.render('counter', context);
});

app.post('/count', function(req, res){
	var context = {};
	if (req.body.command === "resetCount"){
		//req.session.count = 0;
		req.session.destroy();
	}
	else {
		context.err = true;
	}
	if(req.session){
		context.count = req.session.count;
	}
	else{
		context.count = 0;
	}
	//context.count = req.session.count || 0;
	req.session.count = context.count + 1;
	res.render('counter', context);
});

app.use(function (req,res){
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.type('plain/text');
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log('Express starter on http://localhost:' + app.get('port') + '; Press Ctrl_C to terminate.');
});