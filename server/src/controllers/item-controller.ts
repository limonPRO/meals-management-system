import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { paginate, sendResponse } from "../utils/utils";
import { con } from "../db/db";
import { User } from "../types/user-type";

const itemController = {
    addItems: async (req: Request, res: Response) => {
        try {
      
            const errors = validationResult(req);
      
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name, category } = req.body;

            await new Promise((resolve, reject) => {
                con.query(
                    "INSERT INTO items (name, category) VALUES (? , ?)",
                    [name, category],
                    (err: any, result: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                );
            });

            return sendResponse(res, 200, "item added successfully!");
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    },
    updateItem: async (req: Request, res: Response) => {
        try {
            const id = req.params.id;
            const errors = validationResult(req);
   
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { name, category } = req.body;

                 // Check if the user exists
        const [existItems]: User[] = await new Promise((resolve, reject) => {
            con.query(
              "SELECT * FROM items WHERE id = ?",
              [id],
              (err: any, result: any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });
    
          if (!existItems) {
            return sendResponse(res, 400, "User with this is is not found");
          }

            await new Promise((resolve, reject) => {
                con.query(
                  "UPDATE users SET name = ?, category = ? WHERE id = ?",
                    [name, category, id],
                    (err: any, result: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                );
            });

            return sendResponse(res, 200, "items added successfully!");
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }
    },
    allItems: async (req: Request, res: Response) => {
        try {
            const page = parseInt(req.query.page as string) || 1; 
            const perPage = parseInt(req.query.per_page as string) || 10; 
            const searchTerm = req.query.searchTerm as string; 
    
            let query = 'SELECT * FROM items';
    
            if (searchTerm) {
                query += ` WHERE name LIKE '%${searchTerm}%'`; 
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
        
            const totalitems = rows.length;
    
            // Pagination logic
            const startIndex = (page - 1) * perPage;
            const endIndex = startIndex + perPage;
            const totalData = rows.slice(startIndex, endIndex);
    
            const pagination = paginate(totalitems, page, perPage);
    
            return sendResponse(res , 200 , "all items", totalData, pagination)
        } catch (error) {
    
            return res.status(500).json({ message: 'Internal server error' , error});
        }
      },
      getItem: async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const result: any = await new Promise((resolve, reject) => {
                con.query(
                    "SELECT * FROM items WHERE id = ?",
                    [id],
                    (err: any, result: any) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    }
                );
            });

            if (result.length === 0) {
                return sendResponse(res, 404, "Item Not found");
            }

            return sendResponse(res, 200, "Item retrieved successfully!", result[0]);
        } catch (error) {
            res.status(500).json({ message: "Internal server error", error });
        }},

        deleteItem: async (req: Request, res: Response) => {
            try {
                const { id } = req.params;
    
                await new Promise((resolve, reject) => {
                    con.query(
                        "DELETE FROM items WHERE id = ?",
                        [id],
                        (err: any, result: any) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(result);
                            }
                        }
                    );
                });
    
                return sendResponse(res, 200, "Item deleted successfully!");
            } catch (error) {
                res.status(500).json({ message: "Internal server error", error });
            }
        }
};

export default itemController;
