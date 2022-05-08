/* eslint-disable no-tabs */
import { db, Profile } from "../database/models";

export function createProfile(req, res) {
	const name = req.body.name;
	const imgUri = req.body.imgUri;
	console.log(`in createprofile with ${name} and ${imgUri}`);
	Profile.create({ name, imgUri })
		.then(() => {
			console.log("Created single user");
			res.status(200).json({ message: "Created profile successfully" });
		})
		.catch((err) => {
			console.log("failed to create profiles");
			console.log(err);
			res.status(500).json({ message: err });
		});
}
