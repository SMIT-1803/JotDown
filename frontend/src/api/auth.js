import api from "./client.js";

export async function register({ username, email, fullName, password }) {
  const res = await api.post("/users/register", {
    username,
    email,
    fullName,
    password,
  });
  return res.data;
}

export async function login({ email, password }) {
  const res = await api.post("/users/login", { email, password });
  const payload = res.data?.data;
  console.log(payload)
  const { user, accessToken, refreshToken } = payload;
  console.log("Access Token", accessToken)
   console.log("Referesh Token", refreshToken)
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);

  return user;
}

export async function me() {
  const res = await api.get("/users/me");
  const payload = res.data?.data;
  return payload.user;
}

export async function logout() {
  const res = await api.post("/users/logout");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
