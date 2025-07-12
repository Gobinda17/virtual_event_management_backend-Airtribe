process.env.JWT_SECRET = '61f6a7c3724b815cf22efd545ab3451714fe9e0bf291e6a4e48ce6c68160660be73f61007cd4f576ea003b59bfeb07f27b65b6f1f4482ea40e5fa835dcfbd429';
process.env.JWT_EXPIRATION = '1h';

const tap = require('tap');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const supertest = require('supertest');
const app = require('../app');

let mongoServer;
const server = supertest(app);

tap.before(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    console.log('✅ In-memory MongoDB connected for tests');
});


const mockUser = {
    name: 'Clark Kent',
    email: 'clark@superman.com',
    phone: '8638984531',
    password: 'Krypt()n8',
};

const mockOragniserUser = {
    name: 'Harvey Dent',
    email: 'harvey@twoface.com',
    phone: '8638984530',
    password: 'Krypt()n8',
};

const mockEvent = {
    title: "Frontend Hackathon",
    description: "A virtual hackathon focused on React and Vue challenges.",
    date: new Date("2025-08-20"),
    time: "10:00",
    location: "Virtual/Online", // Optional due to default
    capacity: 150,              // Optional due to default
    createdBy: new mongoose.Types.ObjectId(), // Replace with real user ID if needed
    participants: [],
    isActive: true
};


let token = '';

tap.test('POST /event-management/api/v1/register/:role', async (t) => {
    const response = await server.post('/event-management/api/v1/register/user').send(mockUser);
    t.equal(response.status, 200);
    t.end();
});

tap.test('POST /event-management/api/v1/register/:role', async (t) => {
    const response = await server.post('/event-management/api/v1/register/organiser').send(mockOragniserUser);
    t.equal(response.status, 200);
    t.end();
});


tap.test('POST /event-management/api/v1/register/:role with invalid role', async (t) => {
    const response = await server.post('/event-management/api/v1/register/driver');
    t.equal(response.status, 400);
    t.end();
});

tap.test('POST /event-management/api/v1/register/:role with missing email', async (t) => {
    const response = await server.post('/event-management/api/v1/register/user').send({
        name: mockUser.name,
        password: mockUser.password
    });
    t.equal(response.status, 400);
    t.end();
});

tap.test('POST /event-management/api/v1/login/:role', async (t) => {
    const response = await server.post('/event-management/api/v1/login/user').send({
        email: mockUser.email,
        password: mockUser.password
    });
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'token');
    token = response.body.token;
    t.end();
});

tap.test('POST /event-management/api/v1/login/:role', async (t) => {
    const response = await server.post('/event-management/api/v1/login/organiser').send({
        email: mockOragniserUser.email,
        password: mockOragniserUser.password
    });
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'token');
    token = response.body.token;
    t.end();
});

tap.test('POST /event-management/api/v1/login/:role with wrong password', async (t) => {
    const response = await server.post('/event-management/api/v1/login/user').send({
        email: mockUser.email,
        password: 'wrongpassword'
    });
    t.equal(response.status, 401);
    t.end();
});

tap.test('POST /event-management/api/v1/login/:role with wrong email', async (t) => {
    const response = await server.post('/event-management/api/v1/login/user').send({
        email: 'someone@gmail.com',
        password: mockUser.password
    });
    t.equal(response.status, 404);
    t.end();
});

// Event tests

tap.test('GET /event-management/api/v1/service/event', async (t) => {
    const response = await server.get('/event-management/api/v1/service/event').set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.hasOwnProp(response.body, 'data');
    t.end();
});

tap.test('POST /event-management/api/v1/service/event', async (t) => {
    const response = await server.post('/event-management/api/v1/service/event').send(mockEvent).set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.end();
});

tap.test('POST /event-management/api/v1/service/event without token', async (t) => {
    const response = await server.post('/event-management/api/v1/service/event').send(mockEvent);
    t.equal(response.status, 401);
    t.end();
});

tap.test('PUT /event-management/api/v1/service/event/:id', async (t) => {
    const createResponse = await server
        .post('/event-management/api/v1/service/event')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...mockEvent, title: "New Event 1" });

    const eventId = createResponse.body.event._id;

    const response = await server.put(`/event-management/api/v1/service/event/${eventId}`).set('Authorization', `Bearer ${token}`).send({
        title: "Dance Trial",
    });
    t.equal(response.status, 200);
});

tap.test("DELETE /event-management/api/v1/service/event/:id", async (t) => {
    const createResponse = await server
        .post('/event-management/api/v1/service/event')
        .set('Authorization', `Bearer ${token}`)
        .send({ ...mockEvent, title: "New Event 1" });

    const eventId = createResponse.body.event._id;
    const response = await server.delete(`/event-management/api/v1/service/event/${eventId}`).set('Authorization', `Bearer ${token}`);
    t.equal(response.status, 200);
    t.end();
});

tap.test('POST /event-management/api/v1/service/event/:id/register', async (t) => {
    // Create a new event by the organizer
    const createEventRes = await server
        .post('/event-management/api/v1/service/event')
        .set('Authorization', `Bearer ${token}`)
        .send({
            ...mockEvent,
            title: "Nodemailer Conference",
        });

    t.equal(createEventRes.status, 200, 'Event should be created successfully');

    const eventId = createEventRes.body.event._id;

    const loginUserRes = await server.post('/event-management/api/v1/login/user').send({
        email: mockUser.email,
        password: mockUser.password
    });

    t.equal(loginUserRes.status, 200);
    const userToken = loginUserRes.body.token;

    const registerResponse = await server
        .post(`/event-management/api/v1/service/event/${eventId}/register`)
        .set('Authorization', `Bearer ${userToken}`);

    t.equal(registerResponse.status, 200, 'User should register for the event');
    t.end();
});

tap.teardown(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});
