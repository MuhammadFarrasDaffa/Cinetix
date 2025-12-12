const errorHandler = require("../middleware/errorHandler");

function run(err) {
    const req = {};
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
    };
    errorHandler(err, req, res, () => { });
    return res;
}

describe("errorHandler", () => {
    test("Sequelize validation errors -> 400", () => {
        const res = run({ name: "SequelizeValidationError", errors: [{ message: "oops" }] });
        expect(res.status).toHaveBeenCalledWith(400);
    });
    test("Sequelize unique constraint -> 400", () => {
        const res = run({ name: "SequelizeUniqueConstraintError", errors: [{ message: "dup" }] });
        expect(res.status).toHaveBeenCalledWith(400);
    });
    test("Foreign key -> 400", () => {
        const res = run({ name: "SequelizeForeignKeyConstraintError" });
        expect(res.status).toHaveBeenCalledWith(400);
    });
    test("Bad Request -> 400", () => {
        const res = run({ name: "Bad Request", message: "bad" });
        expect(res.status).toHaveBeenCalledWith(400);
    });
    test("Unauthorized -> 401", () => {
        const res = run({ name: "Unauthorized", message: "no" });
        expect(res.status).toHaveBeenCalledWith(401);
    });
    test("JWT -> 401", () => {
        const res = run({ name: "JsonWebTokenError", message: "bad token" });
        expect(res.status).toHaveBeenCalledWith(401);
    });
    test("Forbidden -> 403", () => {
        const res = run({ name: "Forbidden", message: "stop" });
        expect(res.status).toHaveBeenCalledWith(403);
    });
    test("Not Found -> 404", () => {
        const res = run({ name: "Not Found", message: "missing" });
        expect(res.status).toHaveBeenCalledWith(404);
    });
    test("Default -> 500", () => {
        const res = run({ name: "Other", message: "err" });
        expect(res.status).toHaveBeenCalledWith(500);
    });
});
