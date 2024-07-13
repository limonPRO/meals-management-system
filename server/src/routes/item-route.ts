import { Router } from "express";
import { body } from "express-validator";
import itemController from "../controllers/item-controller";
import { verifyUserToken } from "../middilewares/verifyUser";
import { authorize } from "../middilewares/authorise";

const router = Router();

const itemValidationRules = [
    body("name").notEmpty().withMessage("name is required"),
    body("category")
        .notEmpty()
        .withMessage("category is required")
        .isIn(["Protein", "Starch", "Veg", "Salads", "Others"])
        .withMessage("category must be either Protein, Starch, Veg, Salads, Others"),
];

router.post("/add", itemValidationRules, itemController.addItems);
router.put("/update/:id", itemValidationRules, itemController.updateItem);
router.get("/", itemController.allItems);
router.get("/:id", itemController.getItem);
router.delete("/:id", itemController.deleteItem);
export default router;
