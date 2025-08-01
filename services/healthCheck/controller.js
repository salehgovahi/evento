const amqp = require('amqplib');
const axios = require('axios');
const net = require('net');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const mongoose = require('mongoose');

const environments = require('../../configs/environments');

const checkPostgresStatus = async (req, res, next) => {
    try {
        await prisma.$connect();
        res.status(200).json({ object: 'postgres', status: 'up' });
    } catch (error) {
        console.error('Health check failed:', error);
        res.status(503).json({ object: 'postgres', status: 'down', message: error.message });
    } finally {
        await prisma.$disconnect();
    }
};

const checkKavenegarStatus = async (req, res, next) => {
    try {
        const response = await axios.get('https://api.kavenegar.com/v1/0/utils/getdate.json');
        if (response.status === 200) {
            res.status(200).json({
                object: 'kavenegar',
                status: 'success'
            });
        } else {
            res.status(503).json({
                object: 'kavenegar',
                status: 'down',
                message: response.statusText
            });
        }
    } catch (err) {
        res.status(503).json({
            object: 'kavenegar',
            status: 'down',
            message: err.message
        });
    }
};

const checkMongoStatus = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            await mongoose.connect(environments.MONGODB_CONNECTION_STRING, {
                authSource: 'admin'
            });
        }

        await mongoose.connection.db.admin().ping();
        return res.status(200).json({ object: 'mongodb', status: 'up' });
    } catch (error) {
        console.error('MongoDB health check failed:', error);
        return res.status(503).json({ object: 'mongodb', status: 'down', message: error.message });
    }
};

const checkFileServerStatus = async (req, res, next) => {
    // const host = process.env.FILE_SERVER_HOST || 'localhost';
    // const port = Number(process.env.FILE_SERVER_PORT) || 8080;
    // const socket = new net.Socket();
    // socket.setTimeout(3000);
    // socket.on('connect', () => {
    //     socket.destroy(); // File server port is open
    //     return res.status(200).json({ status: 'success' });
    // });
    // socket.on('error', (err) => {
    //     console.error('File server connection error:', err.message);
    //     socket.destroy();
    //     return next(new HttpError(Errors.Something_Went_Wrong));
    // });
    // socket.on('timeout', () => {
    //     console.error('File server connection timed out');
    //     socket.destroy();
    //     return next(new HttpError(Errors.Something_Went_Wrong));
    // });
    // socket.connect(port, host);
};

const checkRabbitMQStatus = async (req, res, next) => {
    try {
        const connection = await amqp.connect({
            protocol: 'amqp',
            hostname: environments.RABBITMQ_SERVER_IP,
            port: environments.RABBITMQ_SERVER_PORT,
            username: environments.RABBITMQ_USER,
            password: environments.RABBITMQ_PASSWORD,
            frameMax: 8192
        });

        await connection.close();
        return res.status(200).json({ object: 'rabbitmq', status: 'up' });
    } catch (error) {
        return res.status(503).json({ object: 'rabbitmq', status: 'down', message: error.message });
    }
};

const checkCertificateServiceStatus = async (req, res, next) => {
    // const host = process.env.CERTIFICATE_SERVICE_HOST || 'localhost';
    // const port = Number(process.env.CERTIFICATE_SERVICE_PORT) || 8080;
    // const socket = new net.Socket();
    // socket.setTimeout(3000);
    // socket.on('connect', () => {
    //     socket.destroy(); // Certificate service port is open
    //     return res.status(200).json({ status: 'success' });
    // });
    // socket.on('error', (err) => {
    //     console.error('Certificate service connection error:', err.message);
    //     socket.destroy();
    //     return next(new HttpError(Errors.Something_Went_Wrong));
    // });
    // socket.on('timeout', () => {
    //     console.error('Certificate service connection timed out');
    //     socket.destroy();
    //     return next(new HttpError(Errors.Something_Went_Wrong));
    // });
    // socket.connect(port, host);
};

module.exports = {
    checkPostgresStatus,
    checkMongoStatus,
    checkKavenegarStatus,
    checkFileServerStatus,
    checkRabbitMQStatus,
    checkCertificateServiceStatus
};
