const request = require('supertest');
const app = require('../../app');

let verificationId;
let verificationCode;

describe('Signup', () => {
    it('Should return error because phone_number is invalid', async () => {
        const signupResponse = await request(app).post('/auth/signup').send({
            phone_number: '123456789',
            password: 'password123'
        });

        expect(signupResponse.statusCode).toBe(422);
        expect(signupResponse.body.message).toBe('شماره تلفن باید یک شماره تلفن معتبر باشد');
    });

    it('Should return error because password is invalid', async () => {
        const signupResponse = await request(app).post('/auth/signup').send({
            phone_number: '09153125487',
            password: 'pass'
        });

        expect(signupResponse.statusCode).toBe(422);
        expect(signupResponse.body.message).toBe('رمز عبور باید شرایط رمز عبور را داشته باشد');
    });

    it('Should sign up a new user and return verification id and code', async () => {
        const signupResponse = await request(app).post('/auth/signup').send({
            phone_number: '09153112511',
            password: 'password123'
        });

        expect(signupResponse.statusCode).toBe(201);
        expect(signupResponse.body.status).toBe('success');
        expect(signupResponse.body.result.verification_id).toBeDefined();
        expect(signupResponse.body.result.verification_code).toBeDefined();

        verificationId = signupResponse.body.result.verification_id;
        verificationCode = signupResponse.body.result.verification_code;
    });

    it('Should return error because phone_number is duplicated', async () => {
        const signupResponse = await request(app).post('/auth/signup').send({
            phone_number: '09153112511',
            password: 'password123'
        });

        expect(signupResponse.statusCode).toBe(409);
        expect(signupResponse.body.message).toBe('شماره تلفن تکراری است');
    });
});

describe('Confirm Signup', () => {
    it('Should return error beacuse phone_number is invalid', async () => {
        const confirmSignupResponse = await request(app).post('/auth/signup/confirm').send({
            phone_number: '1235258',
            verification_id: verificationId,
            verification_code: verificationCode,
            role: 'teacher'
        });

        expect(confirmSignupResponse.statusCode).toBe(422);
        expect(confirmSignupResponse.body.message).toBe('شماره تلفن باید یک شماره تلفن معتبر باشد');
    });

    it('Should return error beacuse phone_number is not signuped before', async () => {
        const confirmSignupResponse = await request(app).post('/auth/signup/confirm').send({
            phone_number: '09153112512',
            verification_id: verificationId,
            verification_code: verificationCode,
            role: 'teacher'
        });

        expect(confirmSignupResponse.statusCode).toBe(404);
        expect(confirmSignupResponse.body.message).toBe(
            'این شماره ثبت نام اولیه را انجام نداده است'
        );
    });

    it('Should return error beacuse verification_code is not valid', async () => {
        const confirmSignupResponse = await request(app).post('/auth/signup/confirm').send({
            phone_number: '09153112512',
            verification_id: '2ccac8Avfvf',
            verification_code: verificationCode,
            role: 'teacher'
        });

        expect(confirmSignupResponse.statusCode).toBe(422);
        expect(confirmSignupResponse.body.message).toBe(
            'شناشه تایید باید یک شناشه تایید معتبر باشد'
        );
    });

    it('Should return error beacuse verification_code is not correct', async () => {
        const confirmSignupResponse = await request(app).post('/auth/signup/confirm').send({
            phone_number: '09153112512',
            verification_id: '45da0832-a8db-4565-9fae-c5ef5dd9548e',
            verification_code: verificationCode,
            role: 'teacher'
        });

        expect(confirmSignupResponse.statusCode).toBe(404);
        expect(confirmSignupResponse.body.message).toBe(
            'شناشه تایید باید یک شناشه تایید معتبر باشد'
        );
    });

    // it('Should confirm signup using verification id and code', async () => {
    //     const confirmSignupResponse = await request(app)
    //         .post('/api/auth/signup/confirm')
    //         .send({
    //             phone_number: '09153112512',
    //             verification_id: verificationId,
    //             verification_code: verificationCode,
    //             role: 'teacher'
    //         });

    //     expect(confirmSignupResponse.statusCode).toBe(201);
    //     expect(confirmSignupResponse.body.status).toBe('success');
    //     expect(confirmSignupResponse.body).toHaveProperty('token');
    // });
});
