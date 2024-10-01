import mongoose from "mongoose";

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Distinguishes operational errors from programming errors
    }
}

export const errorHandler = (err, req, res, next) => {
   

    if (err instanceof mongoose.Error.ValidationError) {
        console.error("Error console in ValidationError:", err.message);
        // Handle Mongoose validation errors
        const errors = Object.values(err.errors).map(el => el.message);
        const message = `${errors.join('. ')}`;
        return res.status(400).json({
            success: false,
            message
        });
    } else if (err instanceof mongoose.Error.ValidatorError) {
        console.error("Error console in ValidatorError:", err.message);
        // Handle Mongoose specific validation error
        return res.status(400).json({
            success: false,
            message: err.message,
            path: err.path,
            value: err.value
        });
    }

    else if (err.code === 11000) {
        // Handle MongoDB duplicate key error
        const field = Object.keys(err.keyValue)[0];
        const message = `An account with this ${field} already exists.`;
        return res.status(400).json({success: false,message,});
    }

    else if(err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        });
    }

    res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again later."
    });
};