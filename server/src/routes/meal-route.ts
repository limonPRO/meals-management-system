import { Router } from "express";
import { body } from "express-validator";
import mealController from "../controllers/meal-controller";

const router = Router();

const mealsValidationRules = [
    body('name').notEmpty().withMessage('Meal name is required'),
    body('items').isArray({ min: 3 }).withMessage('At least 3 item must be selected'),
    body().custom((value, { req }) => {
        if (!Array.isArray(req.body.items)) {
            throw new Error('Items must be an array');
        }
        for (const item of req.body.items) {
            if (typeof item !== 'object' || !item.id) {
                throw new Error('Each item must be an object with an id property');
            }
        }
        return true;
    }),
];

const mealsScheduleValidationRules = [
    body('meal_id').notEmpty().withMessage('meal_id is required'),
    body('scheduled_date')
        .notEmpty().withMessage('scheduled_date is required')
        .isDate({ format: 'YYYY-MM-DD' }).withMessage('scheduled_date must be a valid date in format YYYY-MM-DD'),
];

router.post("/add", mealsValidationRules, mealController.createMeal);
router.post("/schedule-meal", mealsScheduleValidationRules, mealController.scheduleMeal);
router.get("/schedule-meal", mealController.viewMealSchedule);
router.get("/", mealController.viewMealS);
export default router;
