import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
require("dotenv").config();

import { con } from "../db/db";
import { User } from "../types/user-type";
import { hashPassword, paginate, sendResponse, validatePassword } from "../utils/utils";


const authController = {
  registerUser: async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
   
      const [existUser]: User[] = await new Promise((resolve, reject) => {
        con.query(
          "SELECT * FROM users WHERE email = ?",
          [req.body.email],
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      
      if (existUser) {
        return sendResponse(res, 400, "User already exists with this email");
      }

      const role = 'user';

      const hashedPassword = await hashPassword(req.body.password);

      await con.query("INSERT INTO users ( email, password, role ) VALUES (?, ?, ?)",[req.body.email, hashedPassword , role]);

      return sendResponse(res, 200, 'User registered successfully!');
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  login: async (req: Request, res: Response) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        const [existUser]: any = await new Promise((resolve, reject) => {
            con.query(
              "SELECT * FROM users WHERE email = ?",
              [req.body.email],
              (err: any, result: any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });

          if (existUser?.is_banned ) {
            return sendResponse(res, 404, 'You are banned');
        }
      
        if (existUser ) {
          const machedPassword = await validatePassword(
            req.body.password,
            existUser.password
          );
   
          if (machedPassword) {
            const token = jwt.sign(
              { user: { id: existUser.id, email: existUser.email} },
              process.env.JWT_SECRET as string,
              { expiresIn: '1h' }
          );
    
            res.status(201).json({
            message:"successfully login",
            success:true,
            user: existUser,
            token: token,
            });
          } else {
            return sendResponse(res, 404, 'wrong credentials');
          }
        } else {
            return sendResponse(res, 404, 'wrong credentials');
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error});
    }
  
  },

  allusers: async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1; 
        const perPage = parseInt(req.query.per_page as string) || 10; 
        const searchTerm = req.query.searchTerm as string; 

        let query = 'SELECT * FROM users';

        if (searchTerm) {
            query += ` WHERE email LIKE '%${searchTerm}%'`; 
        }
        const rows: User[] = await new Promise((resolve, reject) => {
            con.query(
                query,
              (err: any, result: any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });
    
        const totalUsers = rows.length;

        // Pagination logic
        const startIndex = (page - 1) * perPage;
        const endIndex = startIndex + perPage;
        const usersOnPage = rows.slice(startIndex, endIndex);

        const pagination = paginate(totalUsers, page, perPage);



        return sendResponse(res , 200 , "all users", usersOnPage, pagination)
    } catch (error) {

        return res.status(500).json({ message: 'Internal server error' , error});
    }
  },

  updateUser : async (req: Request, res: Response) => {
    try {
        const userId = req.params.id;
        const { email, password, role, is_banned } = req.body;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }


        // Check if the user exists
        const [existUser]: User[] = await new Promise((resolve, reject) => {
            con.query(
              "SELECT * FROM users WHERE id = ?",
              [userId],
              (err: any, result: any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });
    
          if (!existUser) {
            return sendResponse(res, 400, "User with this is is not found");
          }
        // Prepare update query
        let updateQuery = 'UPDATE users SET ';
        const values :any= [];

        if (email) {
            updateQuery += 'email = ?, ';
            values.push(email);
        }

        // if (password) {
        //     const hashedPassword = await hashPassword(password); // Assuming hashPassword function is defined
        //     updateQuery += 'password = ?, ';
        //     values.push(hashedPassword);
        // }

        if (role) {
            updateQuery += 'role = ?, ';
            values.push(role);
        }

        if (typeof is_banned !== 'undefined') {
            updateQuery += 'is_banned = ?, ';
            values.push(is_banned);
        }

        // Remove the trailing comma and space from updateQuery
        updateQuery = updateQuery.slice(0, -2);

        // Add WHERE clause for specific user
        updateQuery += ' WHERE id = ?';
        values.push(userId);

        // Execute the update query
        await new Promise((resolve, reject) => {
            con.query(updateQuery,values,
              (err: any, result: any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });
   

        return sendResponse(res, 200, 'User updated successfully!');
    } catch (error) {
  
        return res.status(500).json({ message: 'Internal server error' , error});
    }
  },
  addUser: async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, role } = req.body;

      const [existUser]: User[] = await new Promise((resolve, reject) => {
        con.query(
          "SELECT * FROM users WHERE email = ?",
          [email],
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });

      if (existUser) {
        return sendResponse(res, 400, "User already exists with this email");
      }

      const hashedPassword = password ? await hashPassword(password) : null;

      await new Promise((resolve, reject) => {
        con.query(
          "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
          [email, hashedPassword, role],
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });

      return sendResponse(res, 200, 'User added successfully!');
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  },
  getUserById: async (req: Request, res: Response) => {
    try {
      const userId = req.params.id;

      const [user]: User[] = await new Promise((resolve, reject) => {
        con.query(
          "SELECT id, email, role, is_banned FROM users WHERE id = ?",
          [userId],
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });

      if (!user) {
        return sendResponse(res, 404, "User not found");
      }

      return sendResponse(res, 200, "User details", user);
    } catch (error) {
      return res.status(500).json({ message: "Internal server error", error });
    }
}
}


export default authController;
