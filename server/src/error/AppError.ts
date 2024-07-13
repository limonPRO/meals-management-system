import { Request, Response, NextFunction } from 'express';


  export class AppError extends Error {
    status: number;
    
    constructor(status: number, message: string) {
        super(message);
        
        this.status = status;
    }
}


//   export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {

//     res.status(500).json({ error: err.message || 'Internal Server Error' });
// }