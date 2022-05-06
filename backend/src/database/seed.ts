/* eslint-disable no-tabs */
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
		name: "name1",
	},
	{
		name: "name2",
	},
];

const seed = async () => {
	console.log("Beginning seed");

	// force true will drop the table if it already exists
	// such that every time we run seed, we start completely fresh
	await User.sync({ force: true });

	await Profile.sync({ force: true }); // hw2: sync profile table

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
