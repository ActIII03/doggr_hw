import axios from "./HttpService";

export const ProfileServ = {
	async create(profile) {
		return axios.post("/profile", { email: profile.name });
	},
};
