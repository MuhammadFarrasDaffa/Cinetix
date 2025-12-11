const request = require("supertest");

const mockProfile = {
    findOne: jest.fn(),
    update: jest.fn(),
};

jest.mock("../models", () => ({
    Profile: mockProfile,
    User: { findOne: jest.fn(), create: jest.fn() },
    Movie: { findAll: jest.fn() },
    Watchlist: { findAll: jest.fn() },
    Collection: { findOne: jest.fn() },
    Payment: { findAll: jest.fn() },
}));

jest.mock("cloudinary", () => ({
    v2: {
        config: jest.fn(),
        uploader: { upload: jest.fn() },
    },
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

describe("Profile Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("GET /profiles", () => {
        it("should get user profile", async () => {
            mockProfile.findOne.mockResolvedValueOnce({
                id: 1,
                UserId: 1,
                username: "testuser",
            });

            const res = await request(app).get("/profiles");

            expect(res.status).toBe(200);
            expect(res.body.username).toBe("testuser");
        });

        it("should fail if profile not found", async () => {
            mockProfile.findOne.mockResolvedValueOnce(null);

            const res = await request(app).get("/profiles");

            expect(res.status).toBe(404);
        });

        it("should handle errors", async () => {
            mockProfile.findOne.mockRejectedValueOnce(new Error("Error"));

            const res = await request(app).get("/profiles");

            expect(res.status).toBe(500);
        });
    });

    describe("PUT /profiles/:id", () => {
        it("should update profile", async () => {
            mockProfile.findOne.mockResolvedValueOnce({ id: 1 });
            mockProfile.update.mockResolvedValueOnce([1]);

            const res = await request(app)
                .put("/profiles/1")
                .send({ username: "updated" });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Profile updated successfully");
        });

        it("should fail if profile not found", async () => {
            mockProfile.findOne.mockResolvedValueOnce(null);

            const res = await request(app)
                .put("/profiles/1")
                .send({ username: "test" });

            expect(res.status).toBe(404);
        });

        it("should handle update errors", async () => {
            mockProfile.findOne.mockResolvedValueOnce({ id: 1 });
            mockProfile.update.mockRejectedValueOnce(new Error("Error"));

            const res = await request(app)
                .put("/profiles/1")
                .send({ username: "test" });

            expect(res.status).toBe(500);
        });
    });

    describe("PATCH /profiles/update-image", () => {
        it("should return 400 when file missing", async () => {
            const res = await request(app).patch("/profiles/update-image");
            expect(res.status).toBe(400);
        });

        it("should return 400 when mimetype invalid", async () => {
            const res = await request(app)
                .patch("/profiles/update-image")
                .attach("newImage", Buffer.from("hello"), {
                    filename: "test.txt",
                    contentType: "text/plain",
                });
            expect(res.status).toBe(400);
        });

        it("should upload image and update profile", async () => {
            mockProfile.findOne.mockResolvedValueOnce({
                id: 1,
                update: jest.fn().mockResolvedValueOnce({}),
            });

            const { v2: cloudinary } = require("cloudinary");
            cloudinary.uploader.upload.mockResolvedValueOnce({
                secure_url: "https://cdn.example.com/img.png",
            });

            const res = await request(app)
                .patch("/profiles/update-image")
                .attach("newImage", Buffer.from("fakepng"), {
                    filename: "image.png",
                    contentType: "image/png",
                });

            expect(res.status).toBe(200);
            expect(res.body.message).toBe("Image updated");
        });

        it("should handle cloudinary/upload errors", async () => {
            mockProfile.findOne.mockResolvedValueOnce({
                id: 1,
                update: jest.fn().mockResolvedValueOnce({}),
            });

            const { v2: cloudinary } = require("cloudinary");
            cloudinary.uploader.upload.mockRejectedValueOnce(
                new Error("Upload failed")
            );

            const res = await request(app)
                .patch("/profiles/update-image")
                .attach("newImage", Buffer.from("fakepng"), {
                    filename: "image.png",
                    contentType: "image/png",
                });

            expect(res.status).toBe(500);
        });

        it("should return 404 when profile not found", async () => {
            mockProfile.findOne.mockResolvedValueOnce(null);

            const res = await request(app)
                .patch("/profiles/update-image")
                .attach("newImage", Buffer.from("fakepng"), {
                    filename: "image.png",
                    contentType: "image/png",
                });

            expect(res.status).toBe(404);
        });
    });
});
