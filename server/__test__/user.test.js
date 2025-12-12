const request = require("supertest");

// Mock modules BEFORE requiring app
const mockUser = {
    findOne: jest.fn(),
    create: jest.fn(),
};

const mockProfile = {
    create: jest.fn(),
};

jest.mock("../models", () => ({
    User: mockUser,
    Profile: mockProfile,
    Movie: { findAll: jest.fn() },
    Watchlist: { findAll: jest.fn(), findOne: jest.fn(), create: jest.fn(), destroy: jest.fn() },
    Collection: { findOne: jest.fn(), create: jest.fn(), findAll: jest.fn() },
    Payment: { findAll: jest.fn(), create: jest.fn(), update: jest.fn() },
}));

jest.mock("../helpers/jwt", () => ({
    signToken: jest.fn(() => "test_token_123"),
}));


jest.mock("google-auth-library");

// Bypass auth/authorization middlewares in tests
jest.mock("../middleware/authentication", () => (
    req,
    res,
    next
) => {
    req.user = { id: 1, email: "test@test.com" };
    next();
});
jest.mock("../middleware/authorization_profile", () => (req, res, next) => next());
jest.mock("../middleware/authorization_watchlist", () => (req, res, next) => next());

const buildApp = () => {
    jest.resetModules();
    // Inject bcrypt mock per build so compareHash can vary per-test
    jest.doMock("../helpers/bcrypt", () => ({
        hashPassword: jest.fn(() => "hashed"),
        compareHash: jest.fn(() => true),
    }));
    const express = require("express");
    const app = express();
    app.use(express.json());
    app.use(require("../routes"));
    return app;
};


describe("User Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /register", () => {
        it("should register successfully", async () => {
            mockUser.create.mockResolvedValueOnce({ id: 1, email: "test@test.com" });
            mockProfile.create.mockResolvedValueOnce({ UserId: 1 });

            const app = buildApp();
            const res = await request(app)
                .post("/register")
                .send({ email: "test@test.com", password: "pass123" });

            expect(res.status).toBe(201);
            expect(res.body.message).toBe("Register Successfull");
        });

        it("should handle register errors", async () => {
            mockUser.create.mockRejectedValueOnce(new Error("Unique constraint"));

            const app = buildApp();
            const res = await request(app)
                .post("/register")
                .send({ email: "test@test.com", password: "pass" });

            expect(res.status).toBe(500);
        });
    });

    describe("POST /login", () => {
        it("should login successfully with valid credentials", async () => {
            mockUser.findOne.mockResolvedValueOnce({
                id: 1,
                email: "test@test.com",
                password: "hashed",
            });

            const app = buildApp();
            const res = await request(app)
                .post("/login")
                .send({ email: "test@test.com", password: "pass123" });

            expect(res.status).toBe(200);
            expect(res.body.access_token).toBe("test_token_123");
        });

        it("should fail with missing email", async () => {
            const app = buildApp();
            const res = await request(app)
                .post("/login")
                .send({ password: "pass123" });

            expect(res.status).toBe(400);
        });

        it("should fail with missing password", async () => {
            const app = buildApp();
            const res = await request(app)
                .post("/login")
                .send({ email: "test@test.com" });

            expect(res.status).toBe(400);
        });

        it("should fail with invalid email", async () => {
            mockUser.findOne.mockResolvedValueOnce(null);

            const app = buildApp();
            const res = await request(app)
                .post("/login")
                .send({ email: "wrong@test.com", password: "pass" });

            expect(res.status).toBe(401);
        });

        it("should fail with invalid password", async () => {
            mockUser.findOne.mockResolvedValueOnce({
                id: 1,
                email: "test@test.com",
                password: "hashed",
            });
            // Rebuild app with compareHash returning false
            jest.resetModules();
            jest.doMock("../helpers/bcrypt", () => ({
                hashPassword: jest.fn(() => "hashed"),
                compareHash: jest.fn(() => false),
            }));
            const express = require("express");
            const app = express();
            app.use(express.json());
            app.use(require("../routes"));
            const res = await request(app)
                .post("/login")
                .send({ email: "test@test.com", password: "wrong" });

            expect(res.status).toBe(401);
        });
    });

    describe("POST /google-login", () => {
        it("should fail without google token", async () => {
            const app = buildApp();
            const res = await request(app)
                .post("/google-login")
                .send({});

            expect(res.status).toBe(400);
        });
    });
});
