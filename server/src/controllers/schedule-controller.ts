

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
require("dotenv").config();

import { con } from "../db/db";
import { User } from "../types/user-type";
import { hashPassword, paginate, sendResponse, validatePassword } from "../utils/utils";


const scheduleController = {
  getWeeklyMealsInMonth : async (req:any, res:any) => {
    const { month, year } = req.query; // Assuming month and year are passed as query parameters

    try {
        const [rows] :any= await new Promise((resolve, reject) => {
            con.query(`
            SELECT 
                WEEK(scheduled_date) AS week_number,
                YEAR(scheduled_date) AS year,
                CONCAT(YEAR(scheduled_date), '-', LPAD(WEEK(scheduled_date), 2, '0')) AS week_year,
                MIN(scheduled_date) AS week_start,
                MAX(scheduled_date) AS week_end,
                GROUP_CONCAT(meals.name ORDER BY scheduled_date SEPARATOR ', ') AS meals_scheduled
            FROM 
                meal_schedules
            JOIN 
                meals ON meal_schedules.meal_id = meals.id
            WHERE 
                MONTH(scheduled_date) = ? AND YEAR(scheduled_date) = ?
            GROUP BY 
                week_number, year
            ORDER BY 
                scheduled_date ASC;
        `, [month, year],
              (err: any, result: any) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              }
            );
          });

console.log(rows)
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching weekly meals:', error);
        res.status(500).json({ error: 'Error fetching weekly meals' });
    }
}
}

export default scheduleController;
