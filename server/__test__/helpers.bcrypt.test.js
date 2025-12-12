describe("helpers/bcrypt", () => {
    beforeEach(() => {
        jest.resetModules();
    });

    test("hashPassword returns non-plain hash and compareHash validates true", () => {
        const { hashPassword, compareHash } = require("../helpers/bcrypt");
        const password = "S3cr3t!";
        const hash = hashPassword(password);

        expect(typeof hash).toBe("string");
        expect(hash).not.toBe(password);
        expect(compareHash(password, hash)).toBe(true);
    });

    test("compareHash returns false for wrong password and hashes differ per call", () => {
        const { hashPassword, compareHash } = require("../helpers/bcrypt");
        const password = "mypassword";
        const hash1 = hashPassword(password);
        const hash2 = hashPassword(password);

        expect(hash1).not.toBe(hash2);
        expect(compareHash("wrong", hash1)).toBe(false);
    });
});
