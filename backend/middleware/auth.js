import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
export default async function authMiddleware(req, res, next) {
  const token =
    req.cookies?.token ||
    (req.heeders.authorization?.startwith("Bearer")
      ? req.heeders.authorization.split(" ")[1]
      : null);

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "not authorized- token missing" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await UserModel.findById(payload.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        error: true,
        message: " user no longer exiest",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("auth middleware error", error);
    const message =
      error.name === "tokenExpireError" ? "Token expired" : "invalid token";
    res.status(401).json({ success: false, message });
  }
}
