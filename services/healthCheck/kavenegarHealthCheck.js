const fs = require('fs');
const path = require('path');
const axios = require('axios');

const environments = require('../../configs/environments');
const logFilePath = path.join(environments.LOG_PATH, 'kavenegar_healthcheck.log');

const startKavenegarHealthcheck = async () => {
    const check = async () => {
        const start = Date.now();
        let statusCode;
        try {
            const response = await axios.get('https://api.kavenegar.com/v1/0/utils/getdate.json');
            statusCode = response.status;
        } catch (err) {
            statusCode = err.response ? err.response.status : 500;
        }
        const duration = Date.now() - start;

        const logEntry = {
            timestamp: new Date().toISOString(),
            url: 'https://api.kavenegar.com/v1/0/utils/getdate.json',
            status_code: statusCode,
            response_time_ms: duration
        };

        fs.appendFile(logFilePath, JSON.stringify(logEntry) + '\n', (err) => {
            if (err) console.error('Failed to write healthcheck log:', err);
        });
    };

    // run immediately, then every 5 minutes
    check();
    setInterval(check, 5 * 60 * 1000);
};

module.exports = startKavenegarHealthcheck;
