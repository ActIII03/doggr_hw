/* eslint-disable no-tabs */
import { Sequelize, DataTypes } from "sequelize";

const pguser = process.env.PGUSER;
const pghost = process.env.PGHOST;
const pgpass = process.env.PGPASSWORD;
const pgdatabase = process.env.PGDATABASE;
const pgport = process.env.PGPORT;

const connstring = `postgres://${pguser}:${pgpass}@${pghost}:${pgport}/${pgdatabase}`;

export const db = new Sequelize(connstring);

export const User = db.define("users", {
	email: {
		type: DataTypes.STRING,
	},
	password: {
		type: DataTypes.STRING,
	},
});

// random image generator (API): https://www.petfinder.com/developers/v2/docs/

export const Profile = db.define("profile", {
	name: {
		type: DataTypes.STRING,
	},
});
