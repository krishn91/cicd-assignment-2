const request = require('supertest');
const app = require('../src/app');

describe('Express API Tests', () => {
    describe('GET /', () => {
        it('should return welcome message', async () => {
            const res = await request(app).get('/');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('message');
            expect(res.body.message).toContain('Welcome');
        });
    });

    describe('GET /api/health', () => {
        it('should return health status', async () => {
            const res = await request(app).get('/api/health');
            expect(res.statusCode).toBe(200);
            expect(res.body.status).toBe('healthy');
            expect(res.body).toHaveProperty('timestamp');
            expect(res.body).toHaveProperty('uptime');
        });
    });

    describe('GET /api/users', () => {
        it('should return all users', async () => {
            const res = await request(app).get('/api/users');
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.count).toBeGreaterThan(0);
        });
    });

    describe('GET /api/users/:id', () => {
        it('should return a specific user', async () => {
            const res = await request(app).get('/api/users/1');
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('id', 1);
        });

        it('should return 404 for non-existent user', async () => {
            const res = await request(app).get('/api/users/9999');
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe('POST /api/users', () => {
        it('should create a new user', async () => {
            const newUser = {
                name: 'Test User',
                email: 'test@example.com',
            };

            const res = await request(app).post('/api/users').send(newUser);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.data).toHaveProperty('id');
            expect(res.body.data.name).toBe(newUser.name);
            expect(res.body.data.email).toBe(newUser.email);
        });

        it('should return error if name is missing', async () => {
            const res = await request(app).post('/api/users').send({
                email: 'test@example.com',
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it('should return error if email is missing', async () => {
            const res = await request(app).post('/api/users').send({
                name: 'Test User',
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });
    });

    describe('PUT /api/users/:id', () => {
        it('should update a user', async () => {
            const updates = {
                name: 'Updated Name',
                email: 'updated@example.com',
            };

            const res = await request(app).put('/api/users/1').send(updates);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data.name).toBe(updates.name);
        });

        it('should return 404 for non-existent user', async () => {
            const res = await request(app).put('/api/users/9999').send({
                name: 'Test',
            });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe('DELETE /api/users/:id', () => {
        it('should delete a user', async () => {
            const res = await request(app).delete('/api/users/2');
            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
        });

        it('should return 404 for non-existent user', async () => {
            const res = await request(app).delete('/api/users/9999');
            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
        });
    });

    describe('404 Handler', () => {
        it('should return 404 for non-existent routes', async () => {
            const res = await request(app).get('/non-existent-route');
            expect(res.statusCode).toBe(404);
            expect(res.body.error).toBe('Route not found');
        });
    });
});