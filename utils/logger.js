const winston = require('winston');
const path = require('path');
const fs = require('fs');
const moment = require('moment-jalaali'); // Import moment-jalaali
const morgan = require('morgan'); // Import Morgan
const express = require('express'); // Assuming you're using Express

// Define the log file path
const logDirectory = path.join(__dirname, '..', 'logs');

// Ensure the log directory exists; create if it doesn't
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

// Define the log file path
const logFileErrorPath = path.join(logDirectory, 'error.log');
const logFileInfoPath = path.join(logDirectory, 'info.log');

// Custom timestamp format function
const jalaaliTimestampFormat = () => {
    return moment().format('jYYYY/jMM/jDD HH:mm:ss'); // Adjust format as needed
};

const infoLogFormat = winston.format.printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}] ${message}`;
});

// Create a logger instance
const logger = winston.createLogger({
    level: 'info', // Log level for general logging
    format: winston.format.combine(
        winston.format.timestamp({
            format: jalaaliTimestampFormat // Use the custom timestamp format
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple() // For console logs, keep it simple
        }),
        new winston.transports.File({
            filename: logFileErrorPath,
            level: 'error', // Log strictly error messages in error.log
            format: winston.format.json() // For error logs, use JSON format
        }),
        new winston.transports.File({
            filename: logFileInfoPath,
            level: 'info', // Log messages of level info
            format: infoLogFormat // Use custom format for info logs
        })
    ]
});

// Function to log errors
function logError(error) {
    const logEntry = {
        level: 'error',
        message: error.message,
        stack: `${error.stack?.split('\n')[1].trim()}` // Get the first line of the stack
    };
    logger.error(logEntry); // Log using the structured format
}

// Function to log info (you might not need separate function)
function logInfo(message) {
    const logEntry = {
        level: 'info',
        message: message
    };
    logger.info(logEntry); // Log info message
}

module.exports = {
    logError,
    logInfo
};
