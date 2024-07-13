import { Router } from "express";
import { body } from "express-validator";
import mealOrderController from "../controllers/meal-order-controller";
import { verifyUserToken } from "../middilewares/verifyUser";

const router = Router();


const mealsScheduleValidationRules = [
    body('meal_id').notEmpty().withMessage('meal_id is required'),
    body('order_date')
        .notEmpty().withMessage('order_date is required')
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('order_date must be a valid date in format YYYY-MM-DD'),
];

router.post("/select",verifyUserToken,mealsScheduleValidationRules, mealOrderController.selectMeal);
router.put("/select/:id",verifyUserToken,mealsScheduleValidationRules, mealOrderController.updateMealSelection);
export default router;
