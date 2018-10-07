var express = require('express'),
	app = express(),
	path = require('path')

app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('hogan-express'));	
app.set('view engine','html');
app.use(express.static(path.join(__dirname, 'views'))); // This is were ur going to add the path of the css documents

//app.route('/').get(function(req, res, next){
	//res.send('<h1>Hell frankenstein</h1>')
	//res.render('index', {});
//})

require('./routes/routes.js')(express, app);	

app.listen(3000, function(){
	console.log('Frankchat working on port 3000');
})