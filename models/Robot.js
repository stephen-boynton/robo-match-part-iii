const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const RobotSchema = new mongoose.Schema({
	username: { type: String },
	name: { type: String, default: "robot" },
	password: { type: String, default: "0101" },
	avatar: {
		type: String,
		default:
			"https://lh4.googleusercontent.com/-oPlgOXbQxRg/AAAAAAAAAAI/AAAAAAAAAE0/MVRi3AcYzFg/photo.jpg"
	},
	email: { type: String, default: "ab@robot.com" },
	university: { type: String },
	job: { type: String },
	company: { type: String },
	skills: { type: Array },
	phone: { type: String },
	address: {
		street_num: { type: String },
		street_name: { type: String },
		city: { type: String },
		state_or_province: { type: String },
		postal_code: { type: String },
		country: { type: String }
	}
});

RobotSchema.statics.generateHash = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
RobotSchema.methods.validPassword = function(password, dbpassword, done) {
	bcrypt.compare(password, dbpassword, (err, isMatch) => {
		done(err, isMatch);
	});
};

const Robot = mongoose.model("Robot", RobotSchema);

module.exports = Robot;
