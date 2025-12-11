const request = require("supertest");

const mockCollection = {
    findAll: jest.fn(),
};

jest.mock("../models", () => ({
    Collection: mockCollection,
    Movie: {},
    User: { findOne: jest.fn(), create: jest.fn() },
    Profile: { create: jest.fn() },
    Watchlist: { findAll: jest.fn() },
    Payment: { findAll: jest.fn() },
}));

jest.mock("../helpers/jwt", () => ({ signToken: jest.fn(() => "token") }));
jest.mock("../helpers/bcrypt", () => ({ compareHash: jest.fn() }));

// Bypass auth
jest.mock("../middleware/authentication", () => (
    req,
    res,
    next
) => {
    req.user = { id: 1, email: "test@test.com" };
    next();
});

const express = require("express");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    req.user = { id: 1, email: "test@test.com" };
    next();
});
app.use(require("../routes"));

describe("Collection Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /collections", () => {
        it("should get user collections", async () => {
            mockCollection.findAll.mockResolvedValueOnce([
                {
                    id: 1,
                    UserId: 1,
                    MovieId: 1,
                    Movie: { title: "Movie 1" },
                },
            ]);

            const res = await request(app).get("/collections");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body[0].MovieId).toBe(1);
        });

        it("should return empty array if no collections", async () => {
            mockCollection.findAll.mockResolvedValueOnce([]);

            const res = await request(app).get("/collections");

            expect(res.status).toBe(200);
            expect(res.body).toEqual([]);
        });

        it("should handle errors", async () => {
            mockCollection.findAll.mockRejectedValueOnce(
                new Error("DB error")
            );

            const res = await request(app).get("/collections");

            expect(res.status).toBe(500);
        });

        it("should filter by user id", async () => {
            mockCollection.findAll.mockResolvedValueOnce([]);

            await request(app).get("/collections");

            const call = mockCollection.findAll.mock.calls[0][0];
            expect(call.where.UserId).toBe(1);
        });
    });
});
