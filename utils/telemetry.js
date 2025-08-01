const { MeterProvider } = require('@opentelemetry/sdk-metrics');
const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus');

// Create meter provider with the exporter directly
const meterProvider = new MeterProvider({
    readers: [new PrometheusExporter({ startServer: true })]
});

const meter = meterProvider.getMeter('evento');

// Define common metrics
const metrics = {
    requestCounter: meter.createCounter('http_requests_total', {
        description: 'Total number of HTTP requests'
    }),

    signupCounter: meter.createCounter('signup_total', {
        description: 'Total number of user signups'
    }),

    bannedUserCounter: meter.createCounter('banned_user_total', {
        description: 'Total number of banned users'
    }),

    loginCounter: meter.createCounter('login_total', {
        description: 'Total number of user logins'
    }),

    sendSmsCounter: meter.createCounter('send_sms_total', {
        description: 'Total number of SMS sent'
    }),

    sendEmailCounter: meter.createCounter('send_email_total', {
        description: 'Total number of emails sent'
    }),

    dbQueryDuration: meter.createHistogram('db_query_duration_ms', {
        description: 'Database query duration in milliseconds',
        unit: 'ms'
    }),

    activeUsers: meter.createUpDownCounter('active_users', {
        description: 'Number of currently active users'
    }),

    eventRegistrations: meter.createCounter('bootcamp_registrations_total', {
        description: 'Total number of bootcamp registrations'
    }),

    errorCount: meter.createCounter('error_total', {
        description: 'Total number of errors'
    }),

    errorRate: meter.createHistogram('error_rate_per_minute', {
        description: 'Rate of errors per minute'
    }),

    failedLogins: meter.createCounter('failed_login_attempts_total', {
        description: 'Total number of failed login attempts'
    }),

    jwtErrors: meter.createCounter('jwt_validation_errors_total', {
        description: 'Total number of JWT validation errors'
    }),

    rateLimitHits: meter.createCounter('rate_limit_hits_total', {
        description: 'Total number of rate limit hits'
    }),

    responseTime: meter.createHistogram('http_response_time_ms', {
        description: 'HTTP response time in milliseconds',
        unit: 'ms'
    }),
    
    apiLatency: meter.createHistogram('api_latency_seconds', {
        description: 'API endpoint latency',
        unit: 's'
    })
};

module.exports = {
    meter,
    metrics
};
