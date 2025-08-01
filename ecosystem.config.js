module.exports = {
    apps: [
        {
            name: 'server',
            script: './server.js',
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            error_file: '../../logs/server-errors.log',
            out_file: '../../logs/server-output.log',
            log_file: '../../logs/server-entire.log',
            restart_delay: 1000,
            autorestart: true
        }
    ]
};
