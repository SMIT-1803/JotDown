import { register, login, logout, me } from "../api/auth.js";
import React, { use } from "react";
import api from "../api/client.js";


function TestAuth() {
  console.log("BASE:", api.defaults.baseURL);
  const handleRegister = async () => {
    try {
      const user = await register({
        username: "Star",
        email: "abc@gmail.com",
        fullName: "King",
        password: "thePassword",
      });
      console.log("Successful Register", user)
    } catch (error) {
      console.log("Registering error: ", error);
    }
  };

  const handleLogin = async () => {
    try {
      const user = await login({
        email: "abc@gmail.com",
        password: "thePassword",
      });
      console.log("Successful Login",user)
    } catch (error) {
      console.log("Login error: ", error.message);
    }
  };
  const handleMe = async () => {
    try {
      const user = await me();
      console.log("Me:", user);
    } catch (err) {
      console.error("Me failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("Logged out");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };
  return (
    <div className="p-4 flex flex-col gap-2">
      <div
        onClick={handleRegister}
        className="register bg-blue-500 text-white px-3 py-1"
      >
        Register
      </div>
      <div
        onClick={handleLogin}
        className="login bg-blue-500 text-white px-3 py-1"
      >
        Login
      </div>
      <div onClick={handleMe} className="me bg-blue-500 text-white px-3 py-1">
        Me
      </div>
      <div
        onClick={handleLogout}
        className="logout bg-blue-500 text-white px-3 py-1"
      >
        Logout
      </div>
    </div>
  );
}

export default TestAuth;
