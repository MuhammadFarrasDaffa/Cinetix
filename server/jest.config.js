module.exports = {
    testEnvironment: "node",
    collectCoverageFrom: [
        "controllers/**/*.js",
        "routes/**/*.js",
        "middleware/**/*.js",
        "helpers/**/*.js",
        "!**/node_modules/**",
        "!**/__test__/**",
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70,
        },
    },
    testMatch: ["**/__test__/**/*.test.js"],
    testPathIgnorePatterns: ["/node_modules/"],
    coveragePathIgnorePatterns: ["/node_modules/", "/__test__/", "models"],
    verbose: true,
    clearMocks: true,
    restoreMocks: true,
    resetMocks: true,
};
