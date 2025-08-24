import { User } from "../models/user.model.js";
import { ApiResponse } from "../utiils/ApiResponse.js";
import jwt from "jsonwebtoken";

async function generateAccessAndRefreshTokens(userId) {
  try {
    const user = await User.findById(userId._id);
    if(!user){
      throw new Error("User not found to generate tokens")
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error.message)
    throw new Error("Something went wrong while generating tokens: ",error)
  }
}

async function registerUser(req, res) {
  /*
Get user information from front end
Check if anything required is passed empty or not correctly formatted
Check if the user already exists or not
If user does not exist create a new user object and create new entry in the database
Remove password and refresh token from the response received from MongoDB on entry.
Check if the entry is created or not
return response

*/
  // Getting user data
  console.log(req.body)
  const { username, email, fullName, password } = req.body;

  // Validation
  {
    [username, email, fullName, password].map((item) => {
      if (item == "") {
        throw new Error("One of the input fields are empty!!");
      }
    });
  }

  if (!email.includes("@") || email !== email.toLowerCase()) {
    throw new Error("Please enter a valid email");
  }

  // Check if user exists

  try {
    const userExist = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (userExist) {
      throw new Error("User already exists, please login");
    }

    const user = await User.create({
      fullName,
      username: username.toLowerCase(),
      password,
      email,
    });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );
    if (!createdUser) {
      throw new Error("User not created and registered");
    }

    return res
      .status(201)
      .json(new ApiResponse(200, createdUser, "User registered successfully"));
  } catch (error) {
    throw new Error("Something went wrong while registering user.");
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body;
  {
    [email, password].map((item) => {
      if (item == "") {
        throw new Error("One of the input fields are empty!!");
      }
    });
  }

  if (!email.includes("@") || email !== email.toLowerCase()) {
    throw new Error("Please enter a valid email");
  }

  try {
    const user = await User.findOne({
      $or: [{ email }],
    });
    if (!user) {
      throw new Error("User not found. Please register");
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
      throw new Error("Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user._id
    );

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
            refreshToken,
          },
          "User logged in successfully"
        )
      );
  } catch (error) {
    throw new Error("Something went wrong while logging user in.");
  }
}

export { registerUser, loginUser };
