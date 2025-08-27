import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const verifyJWT = async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // Checks if the token is still valid or not
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new Error("Invalid access token");
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT verification error:", error.message);
    next(new Error(error?.message || "Invalid access token"));
  }
};
