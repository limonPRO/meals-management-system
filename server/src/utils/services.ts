import { con } from "../db/db";
import {  AppError } from "../error/AppError";
import { NextFunction, Response } from "express";
import { sendResponse } from "./utils";

export const checkMealConstraints = async (mealItems: any, next: NextFunction , res:Response) => {
    try {
        const itemIds = mealItems.map((item: any) => item.id);

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
            throw new AppError(400,'A meal must have at least 3 items to be complete.');
        }
    
        if (proteinCount > 1) {
            throw new AppError(400,'A meal cannot have two protein sources at a time.');
        }
        // Other constraints checks can be added here

        return true;
    } catch (error) {
      
        return sendResponse(res, 505,'some thing went wrong.');
    }
};
