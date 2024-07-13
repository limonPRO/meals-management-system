import { NextFunction, Request, Response } from 'express';
import { AppError } from '../error/AppError';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError) {
     
        res.status(err.status).json({ success: false, error: err.message });
    } else {
   
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};