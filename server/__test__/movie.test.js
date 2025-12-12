const request = require("supertest");

const mockMovies = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
};

const mockProfile = {
    findOne: jest.fn(),
};

jest.mock("../models", () => ({
    Movie: mockMovies,
    Profile: mockProfile,
    User: { findOne: jest.fn(), create: jest.fn() },
    Watchlist: { findAll: jest.fn() },
    Collection: { findOne: jest.fn() },
    Payment: { findAll: jest.fn() },
}));

jest.mock("@google/genai");
jest.mock("../helpers/jwt", () => ({ signToken: jest.fn(() => "token") }));
jest.mock("../helpers/bcrypt", () => ({ compareHash: jest.fn() }));

// Bypass auth/authorization
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

const express = require("express");
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    req.user = { id: 1, email: "test@test.com" };
    next();
});
app.use(require("../routes"));

describe("Movie Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /movies", () => {
        it("should get all movies", async () => {
            mockMovies.findAll.mockResolvedValueOnce([
                { id: 1, title: "Movie 1", price: 50000 },
            ]);

            const res = await request(app).get("/movies");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
            expect(mockMovies.findAll).toHaveBeenCalled();
        });

        it("should handle errors", async () => {
            mockMovies.findAll.mockRejectedValueOnce(new Error("DB error"));

            const res = await request(app).get("/movies");

            expect(res.status).toBe(500);
        });
    });

    describe("GET /movies/:id", () => {
        it("should get movie by id", async () => {
            mockMovies.findByPk.mockResolvedValueOnce({
                id: 1,
                title: "Movie 1",
                price: 50000,
                tmdbId: 123,
            });

            global.fetch = jest.fn().mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce({
                    title: "Movie 1",
                    overview: "Test",
                }),
            });

            const res = await request(app).get("/movies/1");

            expect(res.status).toBe(200);
            expect(res.body.price).toBe(50000);
        });

        it("should return 404 when movie not found", async () => {
            mockMovies.findByPk.mockResolvedValueOnce(null);

            const res = await request(app).get("/movies/999");

            expect(res.status).toBe(404);
        });

        it("should handle fetch errors", async () => {
            mockMovies.findByPk.mockResolvedValueOnce({
                id: 1,
                title: "Movie 1",
                price: 50000,
                tmdbId: 123,
            });

            global.fetch = jest.fn().mockRejectedValueOnce(new Error("fail"));

            const res = await request(app).get("/movies/1");
            expect(res.status).toBe(500);
        });
    });

    describe("GET /movies/recommendations", () => {
        it("should return recommendations", async () => {
            mockProfile.findOne.mockResolvedValueOnce({
                age: 25,
                preferences: ["Action"],
            });

            mockMovies.findAll.mockResolvedValueOnce([
                { id: 1, title: "Movie 1" },
            ]);

            const { GoogleGenAI } = require("@google/genai");
            GoogleGenAI.mockImplementation(() => ({
                models: {
                    generateContent: jest.fn().mockResolvedValueOnce({
                        text: JSON.stringify([{ id: 1, title: "Movie 1" }]),
                    }),
                },
            }));

            const res = await request(app).get("/movies/recommendations");

            expect(res.status).toBe(201);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it("should fail when profile not found", async () => {
            mockProfile.findOne.mockResolvedValueOnce(null);

            const res = await request(app).get("/movies/recommendations");

            expect(res.status).toBe(404);
        });

        it("should parse codeblock-wrapped JSON", async () => {
            mockProfile.findOne.mockResolvedValueOnce({
                age: 25,
                preferences: ["Action"],
            });
            mockMovies.findAll.mockResolvedValueOnce([{ id: 1, title: "M" }]);
            const { GoogleGenAI } = require("@google/genai");
            GoogleGenAI.mockImplementation(() => ({
                models: {
                    generateContent: jest.fn().mockResolvedValueOnce({
                        text: "```json\n[{\"id\":1}]\n```",
                    }),
                },
            }));

            const res = await request(app).get("/movies/recommendations");
            expect(res.status).toBe(201);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it("should handle genai errors", async () => {
            mockProfile.findOne.mockResolvedValueOnce({
                age: 30,
                preferences: ["Drama"],
            });
            mockMovies.findAll.mockResolvedValueOnce([{ id: 1, title: "M" }]);
            const { GoogleGenAI } = require("@google/genai");
            GoogleGenAI.mockImplementation(() => ({
                models: {
                    generateContent: jest
                        .fn()
                        .mockRejectedValueOnce(new Error("genai")),
                },
            }));

            const res = await request(app).get("/movies/recommendations");
            expect(res.status).toBe(500);
        });
    });
});
