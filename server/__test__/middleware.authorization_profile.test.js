const authorization = require("../middleware/authorization_profile");

jest.mock("../models", () => ({ Profile: { findByPk: jest.fn() } }));

describe("authorization_profile middleware", () => {
    beforeEach(() => jest.clearAllMocks());

    it("allows access when profile belongs to user", async () => {
        const { Profile } = require("../models");
        Profile.findByPk.mockResolvedValueOnce({ id: 1, UserId: 1 });
        const req = { user: { id: 1 } };
        const res = {};
        const next = jest.fn();
        await authorization(req, res, next);
        expect(next).toHaveBeenCalledWith();
    });

    it("forbids when profile not found", async () => {
        const { Profile } = require("../models");
        Profile.findByPk.mockResolvedValueOnce(null);
        const req = { user: { id: 1 } };
        const res = {};
        const next = jest.fn();
        await authorization(req, res, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ name: "Not Found" })
        );
    });

    it("forbids when user mismatched", async () => {
        const { Profile } = require("../models");
        Profile.findByPk.mockResolvedValueOnce({ id: 2, UserId: 99 });
        const req = { user: { id: 1 } };
        const res = {};
        const next = jest.fn();
        await authorization(req, res, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ name: "Forbidden" })
        );
    });
});
