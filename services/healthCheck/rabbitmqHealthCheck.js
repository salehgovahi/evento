const fs = require('fs');
const path = require('path');
const axios = require('axios');

const environments = require('../../configs/environments');

const LOG_PATH = path.join(environments.LOG_PATH, 'rabbitmq_healthcheck.log');

const logMqMetrics = async () => {
    const timestamp = new Date().toISOString();

    try {
        const response = await axios.get('http://localhost:15672/api/queues', {
            auth: {
                username: 'guest',
                password: 'guest'
            }
        });

        const metrics = response.data.map((queue) => ({
            timestamp,
            queue: queue.name,
            metrics: {
                queue_length: queue.messages_ready || 0,
                consumer_lag_ms: queue.consumer_utilisation
                    ? (1 - queue.consumer_utilisation) * 1000
                    : 0,
                publish_rate: queue.message_stats?.publish_details?.rate || 0,
                consume_rate: queue.message_stats?.deliver_get_details?.rate || 0,
                error_rate: queue.message_stats?.redeliver_details?.rate || 0
            }
        }));

        for (const entry of metrics) {
            fs.appendFile(LOG_PATH, JSON.stringify(entry) + '\n', (err) => {
                if (err) console.error('Log write failed:', err);
            });
        }
    } catch (err) {
        console.error('Failed to collect MQ metrics:', err.message);
    }
};

const startMqHealthcheck = () => {
    logMqMetrics();
    setInterval(logMqMetrics, 60 * 1000);
};

module.exports = startMqHealthcheck;
