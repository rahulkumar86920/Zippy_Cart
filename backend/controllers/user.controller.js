import UserModel from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_code";
const TOKEN_EXPIRES = "24";

const createToken = (userId) => {
    jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES });
};

// here register user function is written here
export async function registerUser(req, res) {
  const { name, email, password } = req.body;
  if ((!name, !email, !password)) {
    return res.status(400).json({
      success: false,
      error: true,
      message: "provide email , name ,password for registration",
    });
  }

  // here checking if the user has entered only valid email
  if (!validator.isEmail(email)) {
    return res.status(4000).json({
      success: false,
      error: true,
      message: "Invalid email",
    });
  }
  // if the passwords length is less than 8 characters then  it will return error
  if (password.length < 8) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "password must be atleat 8 characters",
    });
  }

  try {
    if (await UserModel.findOne({ email })) {
      return res.status(400).json({
        error: true,
        success: false,
        message: "user allready exiest in the database ",
      });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      name,
      email,
      password: hashed,
    });

    const token = createToken(user._id);
    res.status(201).json({
      success: true,
      error: false,
      user: { id: user, name: user.name, email: user.email },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
}

// this code is for the login user
export async function loginUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: true,
      success: false,
      message: "email and password is requied",
    });
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "User does not exiest",
      });
    }

    // here first password is being decripted and matching with user entered password with database
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({
        success: false,
        error: true,
        message: "Password does not matched",
      });
    }

    // if everything is okay then user will get the token
    const token = createToken(user._id);
    res.json({
      success: true,
      error: false,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "server error",
    });
  }
}


