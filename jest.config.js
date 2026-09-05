export default {
  testEnvironment: "node",

  collectCoverage: true,

  collectCoverageFrom: [
    "**/*.js",
    "!**/*.test.js",
    "!**/node_modules/**",
    "!coverage/**",
  ],
};
