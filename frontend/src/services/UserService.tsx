import axios from "./HttpService";

export const User = {
  async create(user) {
    return axios.post("/users"
      , { email: user.email, password: user.password }
    )
    
  }
}