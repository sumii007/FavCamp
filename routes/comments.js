var express 	= require("express");
var router 		= express.Router({mergeParams: true}); 
var Campground	= require("../models/campground");
var comment 	= require("../models/comment");
var middleware 	= require("../middleware");


// Comments New
router.get("/new", middleware.isLoggedIn, function(req, res){
	// find by findById
	Campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err);
		} else {
			res.render("comments/new", {campground: campground});
		}
	});
});

// Comments create
router.post("/", middleware.isLoggedIn, function(req, res){
	// Lookup campground using ID
	Campground.findById(req.params.id, function(err, campground){
		if (err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			comment.create(req.body.comment, function(err, comment){
				if (err){
					console.log(err);
				} else {
					// add username and id to comment
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					// save comment
					comment.save();
					campground.comments.push(comment);
					campground.save();
					req.flash("success", "Successfully added comment");
					res.redirect("/campgrounds/" + campground._id);
				}
			});
		}
	});
});

// EDIT COMMENTS
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else{
			res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

// HANDLING EDIT FORM
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// COMMENTS DESTORY ROUTES
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err);
			res.redirect("back");
		} else{
			req.flash("success", "Comment Deleted");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});



module.exports = router;