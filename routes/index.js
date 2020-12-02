var express 	= require("express");
var router 		= express.Router();
var passport 	= require("passport");
var User 		= require("../models/user"); 

// Root Route
router.get("/", function(req, res){
	res.render("landing");
});

// Register form route
router.get("/register", function(req, res){
	res.render("register");
});

// HANDLING SIGN UP FORM
router.post("/register", function(req, res){
	var newUser = new User({username: req.body.username});
	if(req.body.adminCode === "iamadmin"){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			req.flash("error", err.message);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to Yelpcamp " + user.username);
			res.redirect("/campgrounds");
		});
	});
});

// LOGIN ROUTES
router.get("/login", function(req, res){
	res.render("login");
});

//HANDLING LOGN ROUTES
router.post("/login", passport.authenticate("local", {
	successRedirect: "/campgrounds",
	failureRedirect: "/login"
}) , function(req, res){
});

// LOGOUT LOGIC
router.get("/logout", function(req, res){
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/campgrounds");
});

// Middleware
function isLoggedIn(req, res, next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
};

module.exports = router;