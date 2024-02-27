import express, { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');

declare module 'express-serve-static-core' {
    interface Request {
      userId?: number;
    }
  }

// Middleware for verifying the token
export function verifyToken(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: "Authorization token required" });
        return
    }

    const token = authHeader.split(' ')[1].replace(/^"|"$/g, '');
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      req.userId = decoded.userId;
      
      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token." });
    }
  }

export function validateBookingDates(req: Request, res: Response, next: NextFunction): void {
    const { checkIn, checkOut } = req.body;
  
    if (new Date(checkIn) >= new Date(checkOut)) {
      res.status(400).json({ message: "Check-out date must be after check-in date." });
      return;
    }
    next();
  }
