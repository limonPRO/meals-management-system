import { Router } from "express";
import { body } from "express-validator";
import authController from "../controllers/auth-controller";

const router = Router();

const userValidationRules = [
  body("email").notEmpty().withMessage("Email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const userAddValidationRules = [
    body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Must be a valid email address'),
    body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('role').notEmpty().withMessage('Role is required').isIn(['Admin', 'General']).withMessage('Role must be either Admin or General'),
    body('is_banned').optional().isBoolean().withMessage('is_banned must be a boolean value'),
];

export const userUpdateValidationRules = [
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Must be a valid email address'),
  // body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').notEmpty().withMessage('Role is required').isIn(['Admin', 'General']).withMessage('Role must be either Admin or General'),
  body('is_banned').optional().isBoolean().withMessage('is_banned must be a boolean value'),
];


router.post("/registration", userValidationRules, authController.registerUser);
router.post("/login", userValidationRules, authController.login);
router.put("/update/:id", userUpdateValidationRules, authController.updateUser);
router.get("/", authController.allusers);
router.get("/:id", authController.getUserById);
router.post("/add", userAddValidationRules, authController.addUser);

export default router;
