/* eslint-disable no-tabs */
import { db, Profile } from "../database/models";

export const checkDuplicateProfile = (req, res, next) => {
	console.log("Checking duplicate profile");
	console.log(req.body);
	// Username
	Profile.findOne({
		where: {
			name: req.body.name,
		},
	}).then((profile) => {
		if (profile) {
			console.log("Sending failed bc profile name already exist");
			res.status(400).send({
				message: "Failed! Profile name is already in use!",
			});
			return;
		}
		console.log("Profile name not in use");
		next();
	});
};
