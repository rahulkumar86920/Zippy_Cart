import UserModel from "../models/user.model.js";
import validator from "validator";
import bcrypt from "bcrypt";


const JWT_SECRET = process.env.JWT_SECRET || "jwt_secret_code"
const TOKEN_EXPIRES = "24"

const createToken = (userId) =>{
        
}

export async function registerUserController(req, res) {
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

      const hashed = await bcrypt.hash(password, 10);
      const user = await UserModel.create({
        name,
        email,
        password: hashed,
      });
      const token = createToken(user._id);
    }
  } catch (error) {}
}
