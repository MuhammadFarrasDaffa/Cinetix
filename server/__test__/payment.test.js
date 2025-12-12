const request = require("supertest");

const mockPayment = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
};

const mockCollection = {
    findOne: jest.fn(),
    create: jest.fn(),
};

jest.mock("../models", () => ({
    Payment: mockPayment,
    Collection: mockCollection,
    Movie: { findByPk: jest.fn() },
    User: { findOne: jest.fn(), create: jest.fn() },
    Profile: { create: jest.fn() },
    Watchlist: { findAll: jest.fn() },
}));

jest.mock("midtrans-client");

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

const midtransClient = require("midtrans-client");

describe("Payment Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /payments/create", () => {
        it("should create transaction", async () => {
            mockCollection.findOne.mockResolvedValueOnce(null);

            midtransClient.Snap.mockImplementation(() => ({
                createTransaction: jest.fn().mockResolvedValueOnce({
                    token: "snap_token",
                    redirect_url: "https://midtrans.com",
                }),
            }));

            mockPayment.create.mockResolvedValueOnce({ id: 1 });
            mockCollection.create.mockResolvedValueOnce({ id: 1 });

            const res = await request(app)
                .post("/payments/create")
                .send({ movieId: 1, title: "Movie", price: 50000 });

            expect(res.status).toBe(201);
            expect(res.body.snapToken).toBe("snap_token");
        });

        it("should fail if already own movie", async () => {
            mockCollection.findOne.mockResolvedValueOnce({ id: 1 });

            const res = await request(app)
                .post("/payments/create")
                .send({ movieId: 1, title: "Movie", price: 50000 });

            expect(res.status).toBe(400);
        });

        it("should fail if missing fields", async () => {
            const res = await request(app)
                .post("/payments/create")
                .send({ movieId: 1 });

            expect(res.status).toBe(400);
        });

        it("should handle midtrans errors", async () => {
            mockCollection.findOne.mockResolvedValueOnce(null);
            const midtransClient = require("midtrans-client");
            midtransClient.Snap.mockImplementation(() => ({
                createTransaction: jest
                    .fn()
                    .mockRejectedValueOnce(new Error("midtrans")),
            }));

            const res = await request(app)
                .post("/payments/create")
                .send({ movieId: 2, title: "X", price: 10000 });
            expect(res.status).toBe(500);
        });
    });

    describe("POST /payments/webhook", () => {
        it("should handle webhook", async () => {
            midtransClient.CoreApi.mockImplementation(() => ({
                transaction: {
                    notification: jest.fn().mockResolvedValueOnce({
                        order_id: "ORDER-123",
                        transaction_status: "capture",
                    }),
                },
            }));

            const mockPaymentObj = { UserId: 1, MovieId: 1 };
            mockPayment.update.mockResolvedValueOnce([1, [mockPaymentObj]]);
            mockCollection.findOne.mockResolvedValueOnce(null);
            mockCollection.create.mockResolvedValueOnce({});

            const res = await request(app)
                .post("/payments/webhook")
                .send({ order_id: "ORDER-123" });

            expect(res.status).toBe(200);
            expect(res.body.status).toBe("OK");
        });

        it("should handle webhook error", async () => {
            midtransClient.CoreApi.mockImplementation(() => ({
                transaction: {
                    notification: jest
                        .fn()
                        .mockRejectedValueOnce(new Error("Error")),
                },
            }));

            const res = await request(app)
                .post("/payments/webhook")
                .send({});

            expect(res.status).toBe(500);
        });
    });

    describe("GET /payments", () => {
        it("should get user payments", async () => {
            mockPayment.findAll.mockResolvedValueOnce([
                { id: 1, OrderId: "ORDER-123", status: "settlement" },
            ]);

            const res = await request(app).get("/payments");

            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });

        it("should handle errors", async () => {
            mockPayment.findAll.mockRejectedValueOnce(new Error("Error"));

            const res = await request(app).get("/payments");

            expect(res.status).toBe(500);
        });
    });
});
