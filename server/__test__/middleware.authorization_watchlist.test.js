const authorization = require("../middleware/authorization_watchlist");

jest.mock("../models", () => ({ Watchlist: { findByPk: jest.fn() } }));

describe("authorization_watchlist middleware", () => {
    beforeEach(() => jest.clearAllMocks());

    it("allows when watchlist belongs to user", async () => {
        const { Watchlist } = require("../models");
        Watchlist.findByPk.mockResolvedValueOnce({ id: 1, UserId: 1 });
        const req = { user: { id: 1 } };
        const next = jest.fn();
        await authorization(req, {}, next);
        expect(next).toHaveBeenCalledWith();
    });

    it("not found when no watchlist", async () => {
        const { Watchlist } = require("../models");
        Watchlist.findByPk.mockResolvedValueOnce(null);
        const req = { user: { id: 1 } };
        const next = jest.fn();
        await authorization(req, {}, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ name: "Not Found" })
        );
    });

    it("forbidden when mismatched user", async () => {
        const { Watchlist } = require("../models");
        Watchlist.findByPk.mockResolvedValueOnce({ id: 1, UserId: 2 });
        const req = { user: { id: 1 } };
        const next = jest.fn();
        await authorization(req, {}, next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ name: "Forbidden" })
        );
    });
});
