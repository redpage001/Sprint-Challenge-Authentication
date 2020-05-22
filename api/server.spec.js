const supertest = require('supertest');

const server = require('./server');

const db = require('../database/dbConfig');

beforeEach(() => {
    return db.migrate.rollback().then(() => db.migrate.latest()).then(() =>  db.seed.run());
});

describe('server', () => {
    it('should run tests', () => {
        expect(true).toBeTruthy()
    })

    describe('POST /api/auth/register', () => {
        it('should return http status 201', async() => {
            const response = await supertest(server)
                .post('/api/auth/register')
                .send({ username: "TestUser", password: "TestPassword" })

            expect(response.status).toBe(201)
        })

        it('should have an id', async() => {
            const response = await supertest(server)
                .post('/api/auth/register')
                .send({ username: "TestUser", password: "TestPassword" })

            expect(response.body.data.id).toBeDefined()
        })
    })

    describe('POST /api/auth/login', () => {
        it('should return http status 200', async() => {
            const response = await supertest(server)
                .post('/api/auth/login')
                .send({ username: "user1", password: "password1"})

            expect(response.status).toBe(200)
        })

        it('should have token', async() => {
            const response = await supertest(server)
                .post('/api/auth/login')
                .send({ username: "user1", password: "password1"})
            
            expect(response.body.token).toBeDefined()
        })
    })

    describe('GET /api/jokes', () => {
        it('should return http status 400 if not logged in', async() => {
            const response = await supertest(server)
                .get('/api/jokes')

            expect(response.status).toBe(400)
        })

        it('should return http status 200 if logged in', async() => {
            const loggedIn = await supertest(server)
                .post('/api/auth/login')
                .send({ username: "user1", password: "password1" });

            const response = await supertest(server)
                .get('/api/jokes')
                .set('authorization', loggedIn.body.token)

            expect(response.status).toBe(200)
        })
    })
})