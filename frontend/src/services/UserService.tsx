import axios from "./HttpService";

export const User = {
	async create(user) {
		return axios.post("/users", { email: user.email, password: user.password });
	},
};

/*
export const Profile = {
  async create(profile) {
    return axios.post("/users"
      , { email: profile.email, password: user.password }
    )
    
  }
}
*/
