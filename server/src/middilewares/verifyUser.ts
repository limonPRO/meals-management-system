import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
require("dotenv").config();



export const verifyUserToken = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "Unauthorized request" });

  try {
    token = token.split(" ")[1]; // Remove Bearer from string

    if (!token || token === "null")
      return res.status(401).json({ message: "Unauthorized request" });

    const verifiedUser = jwt.verify(token, process.env.JWT_SECRET as string) as any

    if (!verifiedUser)
      return res.status(401).json({ message: "Unauthorized request" });

    (req as any).user = verifiedUser.user;  // Set req.user to the decoded user object

    next();
  } catch (error) {
    return res.status(400).send("Invalid Token");
  }
};
