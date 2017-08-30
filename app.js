const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const {
	getRobots,
	getUnemployed,
	getEmployed,
	getUser,
	getByID
} = require("./dal");

app.engine("mustache", mustacheExpress());
app.set("view engine", "mustache");
app.set("views", __dirname + "/views");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(
	session({
		secret: "hamsandwich",
		saveUninitialized: false,
		resave: false
	})
);

app.use((req, res, next) => {
	if (req.session.AU) {
		next();
	} else {
		req.session.AU = false;
		next();
	}
});

function loginCheck(req, res, next) {
	const user = req.body.username;
	const pwd = req.body.password;
	getUser(user).then(robo => {
		console.log(pwd, robo.password);
		if (pwd === robo.password) {
			req.session.AU = true;
			req.session.robot = robo;
			next();
		} else {
			req.session.AU = false;
			req.session.message = "Incorrect username/password...";
			res.redirect("/");
		}
	});
}

app.get("/", (req, res) => {
	const userSession = req.session;
	res.render("login", { userSession });
});

app.post("/logged", loginCheck, (req, res) => {
	if (req.session.AU) {
		res.redirect("/robots");
	} else {
		res.redirect("/");
	}
});

app.get("/robots", (req, res) => {
	const userSession = req.session;
	getRobots().then(robots => {
		console.log(robots);
		res.render("home", { robots, userSession });
	});
});

app.get("/:id", (req, res) => {
	const userSession = req.session;
	getByID(req.params.id).then(robot => {
		if (userSession.robot._id === req.params.id) {
			res.render("ind-edit", { robot, userSession });
		} else {
			res.render("individual", { robot, userSession });
		}
	});
});

app.get("/edit", (req, res) => {
	const userSession = req.session;
	res.redner("edit", { userSession });
});

app.get("/robots/unemployed", (req, res) => {
	getUnemployed().then(unemployed => {
		res.render("home", { robots: unemployed });
	});
});

app.get("/robots/employed", (req, res) => {
	getEmployed().then(employed => {
		res.render("home", { robots: employed });
	});
});

app.set("port", 3000);

app.listen(app.get("port"), () => {
	console.log("Your app has started, sir.");
});
