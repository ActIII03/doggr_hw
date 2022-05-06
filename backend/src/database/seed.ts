import "dotenv/config";
import { Sequelize, DataTypes } from "sequelize";
import { db, User, Profile } from "./models";

const userSeedData = [
	{ email: "test@gmail.com", password: "123456" },
	{ email: "test2@email.com", password: "password" },
];

// hw2
const profileSeedData = [
	{
		imgUri: "/testUri1",
		thumbUri: "testThumbUri1",
		name: "name1",
		profileId: "123456",
	},
	{
		imgUri: "/testUri2",
		thumbUri: "testThumbUri2",
		name: "name2",
		profileId: "123457",
	},
];

const seed = async () => {
	console.log("Beginning seed");

	// force true will drop the table if it already exists
	// such that every time we run seed, we start completely fresh
	await User.sync({ force: true });

	console.log("Tables have synced!");

	await User.bulkCreate(userSeedData, { validate: true })
		.then(() => {
			console.log("Users created");
		})
		.catch((err) => {
			console.log("failed to create seed users");
			console.log(err);
		});

	// hw2: seed profile (init)

	await Profile.sync({ force: true });

	await Profile.bulkCreate(profileSeedData, { validate: true })
		.then(() => {
			console.log("Profile created");
		})
		.catch((err) => {
			console.log("failed to create seed profiles");
			console.log(err);
		});
};

seed();
