const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const MongoStore = require("connect-mongo")(session);
const roboRoutes = require("./routes/robo-routes");
const { getUser, addRobot } = require("./dal");
const passportConfig = require("./models/passport");
const { isAuthenticated } = require("./models/passport");
// const local = require("./models/passport")(passport);

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
	session({
		resave: true,
		saveUninitialized: true,
		secret: "hamsammy"
	})
);

app.use(passport.initialize());
app.use(passport.session());
app.use(isAuthenticated);

app.use((req, res, next) => {
	console.log("Auth check " + req.session.AU);
	if (req.session.AU) {
		console.log("selecting true");
		req.session.AU = true;
		next();
	} else {
		console.log("selecting false");
		req.session.AU = undefined;
		next();
	}
});

// function loginCheck(req, res, next) {
// 	const user = req.body.username;
// 	const pwd = req.body.password;
// 	getUser(user).then(robo => {
// 		console.log(pwd, robo.password);
// 		if (pwd === robo.password) {
// 			req.session.AU = true;
// 			req.session.robot = robo;
// 			next();
// 		} else {
// 			req.session.AU = false;
// 			req.session.message = "Incorrect username/password...";
// 			res.redirect("/");
// 		}
// 	});
// }

app.use("/robots", roboRoutes);

app.get("/", (req, res) => {
	const userSession = req.session;
	res.render("login", { userSession });
});

app.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/robots",
		failureRedirect: "/"
	})
);

app.get("/signup", isAuthenticated, (req, res) => {
	res.render("sign-up");
});

app.post("/signed", (req, res) => {
	addRobot(req.body).then(() => {
		res.redirect("/");
	});
});

app.get("/edit", (req, res) => {
	const userSession = req.session;
	res.redner("edit", { userSession });
});

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
