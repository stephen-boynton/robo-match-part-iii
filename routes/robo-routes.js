const router = require("express").Router();
const {
	getRobots,
	getUnemployed,
	getEmployed,
	getByID,
	updateRobot
} = require("../dal");
const { isAuthenticated } = require("../models/passport");

router.route("/").get((req, res) => {
	const loggedIn = req.session.AU;
	const userSession = req.user;
	getRobots().then(robots => {
		res.render("home", { robots, userSession, loggedIn });
	});
});

router.route("/logout").get((req, res) => {
	req.session.AU = false;
	req.logout();
	res.redirect("/robots");
});

router.route("/unemployed").get((req, res) => {
	getUnemployed().then(unemployed => {
		res.render("home", { robots: unemployed });
	});
});

router.route("/employed").get((req, res) => {
	getEmployed().then(employed => {
		res.render("home", { robots: employed });
	});
});

router.route("/:id").get((req, res) => {
	const userSession = req.user;
	getByID(req.params.id).then(robot => {
		console.log("incoming");
		if (userSession) {
			console.log("inside usersession");
			console.log(userSession._id, req.params.id);
			if (userSession._id == req.params.id) {
				res.render("ind-edit", { robot, userSession });
			}
		} else {
			res.render("individual", { robot, userSession });
		}
	});
});

router
	.route("/robo/edit")
	.get((req, res) => {
		const userSession = req.user;
		console.log("/edit");
		res.render("edit", userSession);
	})
	.post((req, res) => {
		updateRobot(req.body, req.user._id).then(() => {
			res.redirect("/");
		});
	});

module.exports = router;
