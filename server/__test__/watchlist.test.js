const request = require("supertest");

const mockWatchlist = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
};

const mockMovie = {
    findByPk: jest.fn(),
};

jest.mock("../models", () => ({
    Watchlist: mockWatchlist,
    Movie: mockMovie,
    User: { findOne: jest.fn(), create: jest.fn() },
    Profile: { create: jest.fn() },
    Collection: { findOne: jest.fn() },
    Payment: { findAll: jest.fn() },
}));

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

describe("Watchlist Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /watchlists", () => {
        it("should get user watchlists", async () => {
            mockWatchlist.findAll.mockResolvedValueOnce([
                { id: 1, UserId: 1, MovieId: 1, Movie: { title: "Movie 1" } },
            ]);

            const res = await request(app).get("/watchlists");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it("should return 404 when no watchlists (null)", async () => {
            mockWatchlist.findAll.mockResolvedValueOnce(null);
            const res = await request(app).get("/watchlists");
            expect(res.status).toBe(404);
        });

        it("should handle errors from DB", async () => {
            mockWatchlist.findAll.mockRejectedValueOnce(new Error("DB"));
            const res = await request(app).get("/watchlists");
            expect(res.status).toBe(500);
        });
    });

    describe("GET /watchlists/:id", () => {
        it("should check if movie in watchlist", async () => {
            mockWatchlist.findOne.mockResolvedValueOnce({ id: 1 });

            const res = await request(app).get("/watchlists/1");

            expect(res.status).toBe(200);
            expect(res.body.isWatchlist).toBe(true);
        });

        it("should return false if not in watchlist", async () => {
            mockWatchlist.findOne.mockResolvedValueOnce(null);

            const res = await request(app).get("/watchlists/1");

            expect(res.status).toBe(200);
            expect(res.body.isWatchlist).toBe(false);
        });
    });

    describe("POST /watchlists/:id", () => {
        it("should add movie to watchlist", async () => {
            mockWatchlist.findOne.mockResolvedValueOnce(null);
            mockMovie.findByPk.mockResolvedValueOnce({ id: 1, title: "Movie" });
            mockWatchlist.create.mockResolvedValueOnce({ id: 1 });

            const res = await request(app).post("/watchlists/1");

            expect(res.status).toBe(201);
            expect(res.body.message).toBe("Movie added to watchlist");
        });

        it("should fail if already in watchlist", async () => {
            mockWatchlist.findOne.mockResolvedValueOnce({ id: 1 });

            const res = await request(app).post("/watchlists/1");

            expect(res.status).toBe(400);
        });

        it("should fail if movie not found", async () => {
            mockWatchlist.findOne.mockResolvedValueOnce(null);
            mockMovie.findByPk.mockResolvedValueOnce(null);

            const res = await request(app).post("/watchlists/999");

            expect(res.status).toBe(404);
        });
    });

    describe("DELETE /watchlists/:id", () => {
        it("should remove from watchlist", async () => {
            mockWatchlist.findOne.mockResolvedValueOnce({ id: 1 });
            mockWatchlist.destroy.mockResolvedValueOnce(1);

            const res = await request(app).delete("/watchlists/1");

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Movie removed from watchlist");
        });

        it("should fail if not in watchlist", async () => {
            mockWatchlist.findOne.mockResolvedValueOnce(null);

            const res = await request(app).delete("/watchlists/1");

            expect(res.status).toBe(404);
        });
    });
});
