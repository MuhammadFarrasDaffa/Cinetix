const authorization = require("../middleware/authorization_watchlist");

jest.mock("../models", () => ({ Watchlist: { findOne: jest.fn() } }));

describe("authorization_watchlist middleware", () => {
    beforeEach(() => jest.clearAllMocks());

    it("allows when watchlist belongs to user", async () => {
        const { Watchlist } = require("../models");
        Watchlist.findOne.mockResolvedValueOnce({ id: 1, UserId: 1 });
        const req = { user: { id: 1 } };
        const next = jest.fn();
        await authorization(req, {}, next);
        expect(next).toHaveBeenCalledWith();
    });

    it("not found when no watchlist", async () => {
        const { Watchlist } = require("../models");
        Watchlist.findOne.mockResolvedValueOnce(null);
        const req = { user: { id: 1 } };
        const next = jest.fn();
        await authorization(req, {}, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ name: "Not Found" })
        );
    });

    it("forbidden when mismatched user", async () => {
        const { Watchlist } = require("../models");
        Watchlist.findOne.mockResolvedValueOnce({ id: 2, UserId: 99 });
        const req = { user: { id: 1 } };
        const next = jest.fn();
        await authorization(req, {}, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ name: "Forbidden" })
        );
    });
});
