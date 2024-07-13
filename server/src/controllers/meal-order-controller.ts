import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { paginate, sendResponse } from "../utils/utils";
import { con } from "../db/db";
import { User } from "../types/user-type";

const mealOrderController = {
    selectMeal : async (req:Request, res:Response) => {
        const errors = validationResult(req);
      
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const userId = (req as any).user?.id
        // console.log(userId)
        const { meal_id, order_date } = req.body;    
        try {
            const today = new Date().toISOString().split('T')[0];
            if (new Date(order_date) < new Date(today)) {
                return res.status(400).json({ error: 'Cannot modify meals for previous days' });
            }
    
            await con.query('INSERT INTO meal_orders (user_id, meal_id, order_date) VALUES (?, ?, ?)', [userId, meal_id, order_date]);
           
            return sendResponse(res, 201, "Meal selected successfully");
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },


    updateMealSelection : async (req:Request, res:Response) => {
        const userId = (req as any).user?.id
        const { meal_id, order_date } = req.body;
         const errors = validationResult(req);
         const id = req.params.id;
         console.log(id)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const today = new Date().toISOString().split('T')[0];
            if (new Date(order_date) < new Date(today)) {
                return res.status(400).json({ error: 'Cannot modify meals for previous days' });
            }
    
            await con.query('UPDATE meal_orders SET meal_id = ? AND order_date = ? WHERE id = ?', [meal_id, order_date , id]);
            res.status(200).json({ message: 'Meal selection updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    },


    scheduleMealsForMonth :async (req:any, res:any) => {
        const userId = req.user.id; // Assuming you have a middleware that sets req.user
        const { month, year, mealChoices } = req.body;
    
        try {
            const daysInMonth = new Date(year, month, 0).getDate();
            const today = new Date().toISOString().split('T')[0];
    
            for (let day = 1; day <= daysInMonth; day++) {
                const date = new Date(year, month - 1, day).toISOString().split('T')[0];
    
                if (new Date(date) < new Date(today)) {
                    continue;
                }
    
                const mealId = mealChoices[day] || null; // Assuming mealChoices is an array with mealId or null for "No Meal"
                await con.query('INSERT INTO meal_orders (user_id, meal_id, order_date) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE meal_id = VALUES(meal_id)', [userId, mealId, date]);
            }
    
            res.status(201).json({ message: 'Meals scheduled for the month successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    }
};

export default mealOrderController;
