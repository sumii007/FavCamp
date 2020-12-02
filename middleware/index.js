var Campground  	= 	require("../models/campground");
var comment 		= 	require("../models/comment");
var middlewareObj 	= 	{};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		Campground.findById(req.params.id, function(err, foundCampground){
			if(err){
				req.flash("error", "Campground not found");
				res.redirect("back");
			} else {
				// Does the user own the Campground?
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else {
					req.flash("error", "Permission Denied!")
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be Logged In first");
		res.redirect("/login");
	}
};

middlewareObj.checkCommentOwnership = function(req, res, next){
	if(req.isAuthenticated()){
		comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				res.redirect("back");
			} else {
				// Does the user own the Comment?
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin){
					next();
				} else {
					req.flash("error", "Permission Denied!");
					res.redirect("back");
				}
			}
		});
	} else {
		req.flash("error", "You need to be Logged In first");
		res.redirect("/login");
	}
};


middlewareObj.isLoggedIn = function(req, res, next){
	if (req.isAuthenticated()){
		next();
	} else {
		req.flash("error", "You need to be logged In first");
		res.redirect("/login");
	}
};

module.exports = middlewareObj;
