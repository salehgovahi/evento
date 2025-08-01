const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const environments = require('../../configs/environments');

// Configure log file path (e.g. /home/you/project/app_logs/db_healthcheck.log)
const logFilePath = path.join(environments.LOG_PATH, 'db_healthcheck.log');

const checkDatabaseHealth = async () => {
    const start = Date.now();
    let statusCode = 200;
    let errorMessage = null;

    try {
        // Just test a simple SELECT
        await prisma.bootcamps.findFirst({
            where: { is_deleted: false },
            select: { id: true }
        });
    } catch (err) {
        statusCode = 500;
        errorMessage = err.message;
    }

    const duration = Date.now() - start;

    const logEntry = {
        timestamp: new Date().toISOString(),
        operation: 'getAllBootCamps',
        status_code: statusCode,
        response_time_ms: duration,
        error: errorMessage
    };

    fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
        if (err) console.error('Failed to write DB healthcheck log:', err);
    });
};

const startDatabaseHealthcheck = () => {
    checkDatabaseHealth(); // Run immediately
    setInterval(checkDatabaseHealth, 5 * 60 * 1000); // Every 5 mins
};

module.exports = startDatabaseHealthcheck;
