module.exports = function (express, app, passport, config, rooms) {
	/* body... */
	var router = express.Router();

	router.get('/', function(req, res, next){
		res.render('index', {title:'Welcome to Frank Chat'});
	})


	//This is the function dats validateds that ur logged in else it returns to the homepage
	function securePages(req, res, next){
		if(req.isAuthenticated()){
			next();
		} else{
			res.redirect('/');
		}
	}

	//This is the routes for the pasportt authentication
	router.get('/auth/facebook', passport.authenticate('facebook'));
	router.get('/auth/facebook/callback', passport.authenticate('facebook', {
		successRedirect:'/chatroom',
		failureRedirect:'/'
	}))

	//Thhis is the routes for the chatroom
	router.get('/chatroom', securePages, function(req, res, next){
		res.render('chatroom', {title:'chatroom', user:req.user, config:config});
	})

	//This is this the routes for the logout 
	router.get('/logout', function(req, res, next){
		req.logout();
		res.redirect('/');
	})

	
	app.use('/', router);
}	