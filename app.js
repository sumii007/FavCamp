var express 				= 	require("express"),
    app 					= 	express(),
 	bodyParser 				= 	require("body-parser"),
	mongoose 				=	require("mongoose"),
	flash					=	require("connect-flash"),
	passport 				=	require("passport"),
	localStrategy 			=	require("passport-local"),
	passportLocalMongoose	=	require("passport-local-mongoose"),
	methodOverride			=	require("method-override"),
	Campground				= 	require("./models/campground"),
	comment 				= 	require("./models/comment"),
	User 					= 	require("./models/user"),
	seedDB					= 	require("./seeds");

var campgroundsRoutes 		= 	require("./routes/campgrounds"),
	commentRoutes			= 	require("./routes/comments"),
	indexRoutes				= 	require("./routes/index");

// seedDB(); // Seed the database
//mongoose.connect('mongodb://localhost:27017/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true,  useFindAndModify: false });

mongoose.connect('mongodb+srv://sumii:Sumeet@007@project.qarfp.mongodb.net/sumii?retryWrites=true&w=majority', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true
}).then(() => {
	console.log("DB Connected!");
}).catch(err => {
	console.log("ERROR:", err.message);
});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');

//PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "credential confirm",
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);




app.listen(3000, () => {
	console.log("Yelpcamp server has started!!");
});