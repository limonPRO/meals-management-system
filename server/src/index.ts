import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { con } from "./db/db";
import cors from "cors";
import authRoutes from "./routes/auth-route"
import itemRoutes from "./routes/item-route"
import mealRoute from "./routes/meal-route"
import mealOrderRoute from "./routes/meal-order-route"
import { errorHandler } from "./middilewares/errorHandler";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});



app.use(cors({origin:true}))
app.use(express.json());

// app.use(errorHandler);


app.use('/users', authRoutes);
app.use('/item', itemRoutes);
app.use('/meal', mealRoute);
app.use('/meal', mealOrderRoute);

// Global error handler - should be the last middleware
app.use(errorHandler);


app.listen(port, () => {
  con.connect(function (err: any) {
    if (err) {
      // console.log(err)
      // If there is a database connection error, throw an AppError
      // throw new AppError('Database connection failed', 500);
    }})
    console.log("database Connected")
  console.log(`[server]: Server is running at http://localhost:${port}`);
});