import bcrypt from "bcrypt";
import { Response } from 'express';

interface Pagination {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    has_next_page: boolean;
}

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, 10);
  };
  
  export const validatePassword = async (
    plainPassword: string,
    hashedPassword: string
  ) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
  };
  

  export const sendResponse = <T>(res: Response, statusCode: number, message: string, data?: any , paginatation?:T): Response => {
    return res.status(statusCode).json({
        success: statusCode < 400,
        message,
        ...(data !== undefined && { data }),
        ...(paginatation !== undefined && { paginatation }),
      });
  };

  export const paginate = (totalItems: number, currentPage: number, perPage: number): Pagination => {
    const total = totalItems;
    const per_page = perPage;
    const current_page = currentPage;
    const total_pages = Math.ceil(total / per_page);
    const has_next_page = current_page < total_pages;

    return {
        total,
        per_page,
        current_page,
        total_pages,
        has_next_page,
    };
};