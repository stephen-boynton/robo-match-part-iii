const passport = require("passport");
const { Strategy: LocalStrategy } = require("passport-local");
const Robot = require("./Robot");

passport.serializeUser(function(robot, done) {
	done(null, robot.id);
});

passport.deserializeUser(function(id, done) {
	Robot.findById(id, function(err, robot) {
		done(err, robot);
	});
});

passport.use(
	new LocalStrategy(function(username, password, done) {
		Robot.findOne({ username: username }, function(err, robot) {
			if (err) {
				return done(err);
			}
			if (!robot) {
				return done(null, false, { message: "Incorrect username." });
			}
			robot.validPassword(password, robot.password, (err, isMatch) => {
				if (isMatch) {
					return done(null, robot);
				}
				console.log("Failure");
				return done(null, false, { message: "Incorrect password." });
			});
		});
	})
);

const isAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		req.session.AU = true;
		return next();
	}
	return next();
};
module.exports = { isAuthenticated };

//function(passport) {
// 	passport.serializeUser(function(robot, done) {
// 		done(null, robot.id);
// 	});
//
// 	passport.deserializeUser(function(id, done) {
// 		User.findById(id, function(err, robot) {
// 			done(err, robot);
// 		});
// 	});
// };
