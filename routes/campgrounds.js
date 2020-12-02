var express 	= require("express");
var router		= express.Router();
var Campground 	= require("../models/campground");
var middleware	= require("../middleware");

// INDEX OR STARTING PAGE

router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if (err){
			console.log(err);
		}	else {
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	});
	
});

// CREATE

router.post("/", middleware.isLoggedIn, function(req, res){
	var name = req.body.name;
	var price = req.body.price
	var image = req.body.image;
	var desc = req.body.description
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var newCampground = {name: name, price: price, image: image, description: desc, author: author};
	Campground.create(newCampground, function(err, newlyCreate){
		if (err){
			console.log(err);
		}	else{
			// redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});	
});

// NEW

router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

// SHOW

router.get("/:id", function (req, res){
	// Finding the campgroun with the provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if (err){
			console.log(err);
		} else {
			// render show template with the campground
			res.render("campgrounds/show", {campgrounds: foundCampground});
		}
	});
		
	});


// EDIT CAMPGROUNDS
router.get("/:id/edit", middleware.checkCampgroundOwnership ,function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campgrounds: foundCampground});
	});
});

// UPDATE CAMPGROUNDS
router.put("/:id", middleware.checkCampgroundOwnership , function(req, res){
	// Find and Update the Correct Campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCamp){
		if(err){
			console.log(err);
		} else{
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, { $pull: { comments: req.params.comment_id } } ,function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});



module.exports = router;