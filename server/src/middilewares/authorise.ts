import { NextFunction, Request, Response } from "express";
import { con } from "../db/db";
import jwt from "jsonwebtoken";

export const authorize = (role: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    let token = req.headers.authorization;

    try {
      token = token?.split(" ")[1]; // Remove Bearer from string

      if (!token || token === "null")
        return res.status(401).json({ message: "Unauthorized request" });

      const verifiedUser = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as any;

      if (!verifiedUser)
        return res.status(401).json({ message: "Unauthorized request" });

      // const user = await con.query('SELECT * FROM users WHERE id = ?', [verifiedUser?.user?.id]);
      const [user]: any = await new Promise((resolve, reject) => {
        con.query(
          "SELECT * FROM users WHERE id = ?",
          [verifiedUser?.user?.id],
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      if (!user || user?.role !== role) {
        return res
          .status(403)
          .json({ error: "Authorization failed: User not authorized" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  };
};
