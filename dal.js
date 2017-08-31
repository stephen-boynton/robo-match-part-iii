const mongoose = require("mongoose");
const Robot = require("./models/Robot");
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost:27017/robotsdb2");

function getRobots() {
	return Robot.find();
}

function getUser(user) {
	return Robot.findOne({ username: user });
}

function getByID(id) {
	return Robot.findOne({ _id: id });
}

function editRobots() {}

function getUnemployed() {
	return Robot.find({ job: null });
}

function getEmployed() {
	return Robot.find({ job: { $ne: null } });
}

function addRobot(newRobot) {
	const hash = Robot.generateHash(newRobot.password);
	const robot = new Robot({
		username: newRobot.username,
		password: hash
	});
	robot.save(function(err) {
		console.log(err);
	});
	return Promise.resolve("success");
}

function updateRobot(info, id) {
	console.log(id);
	Robot.update(
		{ _id: id },
		{
			$set: {
				name: info.name,
				avatar: info.avatar,
				email: info.email,
				university: info.university,
				job: info.job
			}
		},
		function(err, raw) {
			if (err) return handleError(err);
			console.log("The raw response from Mongo was ", raw);
		}
	);
	return Promise.resolve("success");
}

module.exports = {
	editRobots,
	getRobots,
	getUser,
	getByID,
	getEmployed,
	getUnemployed,
	updateRobot,
	addRobot
};
