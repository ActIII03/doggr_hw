import axios from "./HttpService";

export const ProfileServ = {
	async create(profile) {
		return axios.post("/profiles", {
			name: profile.name,
			imgUri: profile.imgUri,
		});
	},
};
