/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  rootDir: __dirname,
  roots: ["<rootDir>/test"],
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    "\\.(jpg|jpeg|png|gif|svg)$": "identity-obj-proxy",
  },
  transformIgnorePatterns: [
    "node_modules/(?!tweeter-shared)",
  ],
};
