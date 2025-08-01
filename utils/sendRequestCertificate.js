const fs = require('fs');
const axios = require('axios');
const https = require('https');
const FormData = require('form-data');
const environment = require('../configs/environments');

const sendRequestToCertificateGenerator = async (url, template_path, data) => {
    try {
        const httpsAgent = new https.Agent({
            rejectUnauthorized: false // Allow self-signed certificates
        });

        // Create a new FormData instance
        const form = new FormData();

        // Append the data to the FormData instance
        Object.keys(data).forEach((key) => {
            if (data[key] !== undefined) {
                form.append(key, data[key]);
            }
        });

        // Ensure the template_path is valid
        if (!fs.existsSync(template_path)) {
            throw new Error('Template file does not exist at path: ' + template_path);
        }

        form.append('cert_image', fs.createReadStream(template_path));

        const requestConfig = {
            httpsAgent,
            headers: {
                ...form.getHeaders(),
                Authorization: environment.CERTIFICATE_GENERATOR_TOKEN
            }
        };

        // Create a new Axios instance with the custom configuration
        const axiosInstance = axios.create(requestConfig);

        // Send the request with the form data
        const response = await axiosInstance.post(url, form);

        fs.rmSync(template_path);

        return response;
    } catch (error) {
        console.error('Error during file upload:', error.message);
        throw error;
    }
};

module.exports = { sendRequestToCertificateGenerator };
