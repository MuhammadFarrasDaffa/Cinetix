const authentication = require("../middleware/authentication");

jest.mock("../helpers/jwt", () => ({
    verifyToken: jest.fn(),
}));

jest.mock("../models", () => ({ User: { findByPk: jest.fn() } }));

describe("authentication middleware", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should 401 when no authorization header", async () => {
        const req = { headers: {} };
        const res = {};
        const next = jest.fn();
        await authentication(req, res, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ name: "Unauthorized" })
        );
    });

    it("should set req.user when token and user valid", async () => {
        const { verifyToken } = require("../helpers/jwt");
        verifyToken.mockReturnValueOnce({ id: 1 });
        const { User } = require("../models");
        User.findByPk.mockResolvedValueOnce({ id: 1, email: "a@b.c" });

        const req = { headers: { authorization: "Bearer abc" } };
        const res = {};
        const next = jest.fn();
        await authentication(req, res, next);
        expect(req.user).toEqual(expect.objectContaining({ id: 1 }));
        expect(next).toHaveBeenCalledWith();
    });

    it("should 401 when user not found", async () => {
        const { verifyToken } = require("../helpers/jwt");
        verifyToken.mockReturnValueOnce({ id: 99 });
        const { User } = require("../models");
        User.findByPk.mockResolvedValueOnce(null);

        const req = { headers: { authorization: "Bearer xyz" } };
        const res = {};
        const next = jest.fn();
        await authentication(req, res, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ name: "Unauthorized" })
        );
    });

    it("should handle invalid token errors", async () => {
        const { verifyToken } = require("../helpers/jwt");
        verifyToken.mockImplementationOnce(() => {
            const e = new Error("jwt");
            e.name = "JsonWebTokenError";
            throw e;
        });
        const req = { headers: { authorization: "Bearer bad" } };
        const res = {};
        const next = jest.fn();
        await authentication(req, res, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ name: "JsonWebTokenError" })
        );
    });
});
