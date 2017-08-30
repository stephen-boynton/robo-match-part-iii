const mongoose = require("mongoose");

const RobotSchema = new mongoose.Schema({
	username: { type: String },
	name: { type: String },
	password: { type: String, default: "0101" },
	avatar: { type: String },
	email: { type: String },
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

const Robot = mongoose.model("Robot", RobotSchema);

module.exports = Robot;

// MoonSchema.pre("save", function(next) {
// 	if (Moon.find({ name: this.name })) {
// 		return console.log("This moon already exists");
// 	} else {
// 		next();
// 	}
// });

// MoonSchema.pre("save", function(next) {
// 	let siblings = [];
// 	Moon.find({ planet: this.planet }).then(moons => {
// 		moons.forEach((elm, ind, arr) => {
// 			this.siblings.push(elm.name);
// 			elm.siblings.push(this.name);
// 		});
// 		console.log(this);
// 		next();
// 	});
// });
// MoonSchema.statics.findSiblings = function (planet, cb) {
// 	return this.find({planet: planet})
// }

// PersonSchema.statics.findByEmail = function (email, cb) {
//   return this.find({ email: email })
// }
