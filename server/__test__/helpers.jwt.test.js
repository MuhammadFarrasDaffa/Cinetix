describe("helpers/jwt", () => {
    beforeEach(() => {
        jest.resetModules();
        process.env.SECRET_KEY = "unit_test_secret";
    });

    test("signToken and verifyToken round-trip payload", () => {
        const { signToken, verifyToken } = require("../helpers/jwt");
        const payload = { id: 42, email: "user@test.com" };
        const token = signToken(payload);

        expect(typeof token).toBe("string");

        const decoded = verifyToken(token);
        expect(decoded.id).toBe(42);
        expect(decoded.email).toBe("user@test.com");
        // jwt adds iat, ensure exists
        expect(decoded.iat).toBeDefined();
    });

    test("verifyToken throws for invalid token", () => {
        const { verifyToken } = require("../helpers/jwt");
        expect(() => verifyToken("not-a-real-token"))
            .toThrow();
    });

    test("verifyToken fails with tampered token/secret mismatch", () => {
        const { signToken } = require("../helpers/jwt");
        const payload = { id: 1 };
        const token = signToken(payload);
        // change secret and require a fresh module instance
        jest.resetModules();
        process.env.SECRET_KEY = "different_secret";
        const { verifyToken } = require("../helpers/jwt");
        expect(() => verifyToken(token)).toThrow();
    });
});
