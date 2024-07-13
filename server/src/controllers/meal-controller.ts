import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { con } from "../db/db";
import { checkMealConstraints } from "../utils/services";
import { paginate, sendResponse } from "../utils/utils";

const mealController = {
  createMeal: async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;
    const items = req.body.items;
    const itemIds = items?.map((item: any) => item.id);
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
    
      // Validate meal constraints
      const items: any = await new Promise((resolve, reject) => {
        con.query('SELECT * FROM items WHERE id IN (?)', [itemIds], (err: any, result: any) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });

    const hasRice = items.some((item: any) => item.category === 'Starch');
    const proteinCount = items.filter((item: any) => item.category === 'Protein').length;

    if (!hasRice) {
        // throw new AppError(400, 'A meal must have at least one rice item.');
        return sendResponse(res, 400,'A meal must have at least one rice item.');
    }
    if (items.length < 3) {
        // throw new AppError(400,'A meal must have at least 3 items to be complete.');
        return sendResponse(res, 400,'A meal must have at least 3 items to be complete.');
    }

    if (proteinCount > 1) {
   
        return sendResponse(res, 400,'A meal cannot have two protein sources at a time.');
    }

      const result: any = await new Promise((resolve, reject) => {
        con.query(
          "INSERT INTO meals (name) VALUES (?)",
          [name],
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });

      const mealId = result.insertId;

      for (const item of items) {
        await new Promise((resolve, reject) => {
          con.query(
            "INSERT INTO meal_items (meal_id, item_id) VALUES (?, ?)",
            [mealId, item.id],
            (err: any, result: any) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
      }
      return sendResponse(res, 200, "Meal created successfully");
    } catch (error) {
      // next(error)
      res.status(500).json({ message: "Internal server error", error });
    }
  },

  scheduleMeal: async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { meal_id, scheduled_date } = req.body;
      const existingSchedule: any = await new Promise((resolve, reject) => {
        con.query(
          "SELECT * FROM meal_schedules WHERE meal_id = ? AND scheduled_date = ?",
          [meal_id, scheduled_date],
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      if (existingSchedule.length > 0) {
        return sendResponse(
          res,
          404,
          `Meal ${meal_id} is already scheduled for ${scheduled_date}`
        );
      }

      // Check if scheduledDate is Sunday to Thursday
      const dayOfWeek = new Date(scheduled_date).getDay();
      if (dayOfWeek >= 4) {
        // Sunday (0) to Thursday (3)
        return sendResponse(
          res,
          404,
          `Meal only be schedule from sunday to thursday`
        );
      }
      const startOfWeek = new Date(scheduled_date);
      startOfWeek.setDate(startOfWeek.getDate() - dayOfWeek); // Adjust to start of the week (Sunday)

      const endOfWeek = new Date(scheduled_date);
      endOfWeek.setDate(endOfWeek.getDate() + (4 - dayOfWeek)); // Adjust to end of the week (Thursday)

      // const [repetitions] = await db.query('SELECT COUNT(*) AS count FROM meal_schedules WHERE meal_id = ? AND scheduled_date BETWEEN ? AND ?', [meal_id, startOfWeek, endOfWeek]);// 0 (Sunday) to 6 (Saturday)

      const [repetitions]: any = await new Promise((resolve, reject) => {
        con.query(
          "SELECT COUNT(*) AS count FROM meal_schedules WHERE meal_id = ? AND scheduled_date BETWEEN ? AND ?",
          [meal_id, startOfWeek, endOfWeek],
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      if (repetitions.count > 0) {
        return sendResponse(
          res,
          404,
          `Meal ${meal_id} cannot be scheduled more than twice in a week for day ${dayOfWeek}`
        );
      }
      await new Promise((resolve, reject) => {
        con.query(
          "INSERT INTO meal_schedules (meal_id, scheduled_date) VALUES (?, ?)",
          [meal_id, scheduled_date],
          (err: any, result: any) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      return sendResponse(res, 201, "Meal scheduled successfully");
    } catch (error) {
      res.status(400).json({ error: error });
    }
  },

  viewMealSchedule: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.per_page as string) || 10;
      // const searchTerm = req.query.searchTerm as string;

      let query = "SELECT * FROM items";

      // if (searchTerm) {
      //     query += ` WHERE name LIKE '%${searchTerm}%'`;
      // }

      const schedule: any = await new Promise((resolve, reject) => {
        con.query(
          `
                SELECT meal_schedules.*, meals.name AS meal_name 
                FROM meal_schedules 
                JOIN meals ON meal_schedules.meal_id = meals.id
             `,
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      const totalitems = schedule.length;

      // Pagination logic
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const totalData = schedule.slice(startIndex, endIndex);

      const pagination = paginate(totalitems, page, perPage);

      return sendResponse(res, 200, "all items", totalData, pagination);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },
  
  viewMealS: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const perPage = parseInt(req.query.per_page as string) || 10;
      // const searchTerm = req.query.searchTerm as string;

      let query = "SELECT * FROM items";

      // if (searchTerm) {
      //     query += ` WHERE name LIKE '%${searchTerm}%'`;
      // }

      const meals: any = await new Promise((resolve, reject) => {
        con.query(
          `
            SELECT meals.*, GROUP_CONCAT(items.name SEPARATOR ', ') AS item_names
            FROM meals
            LEFT JOIN meal_items ON meals.id = meal_items.meal_id
            LEFT JOIN items ON meal_items.item_id = items.id
            GROUP BY meals.id
             `,
          (err: any, result: any) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      console.log(meals)
      const totalitems = meals.length;

      // Pagination logic
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const totalData = meals.slice(startIndex, endIndex);

      const pagination = paginate(totalitems, page, perPage);

      return sendResponse(res, 200, "all melas", totalData, pagination);
    } catch (error) {
      res.status(500).json({ error: error });
    }
  },

};

export default mealController;
