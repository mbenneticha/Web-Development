var express = require('express');

var app = express();

app.set('port', 3050);

function RandomNumber(min, max){
	var answer = Math.random()*(max-min) + min;
	return answer;
}

app.get('/', function(req, res){
	res.type('text/plain');
	res.send('Welcome to the main page!', RandomNumber(1, 90));
	console.log(RandomNumber(1,90));
});



app.use(function(req,res){
  res.type('text/plain');
  res.status(404);
  res.send('404 - Not Found');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.send('500 - Server Error');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});