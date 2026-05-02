import jwt from "jsonwebtoken";

export const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || "7d" }
  );
};

export const apiResponse = (success, message, data = null, statusCode = 200) => {
  return {
    success,
    message,
    data,
    statusCode,
  };
};
