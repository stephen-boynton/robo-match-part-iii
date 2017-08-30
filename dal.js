const mongoose = require("mongoose");
const Robot = require("./models/Robot");
mongoose.Promise = require("bluebird");
mongoose.connect("mongodb://localhost:27017/robotsdb2");

function getRobots() {
	return Robot.find();
}

function getUser(user) {
	console.log(user);
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

module.exports = {
	editRobots,
	getRobots,
	getUser,
	getByID,
	getEmployed,
	getUnemployed
};
