/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  //rootDir: "./",
  testEnvironment: "node",
  moduleDirectories: ["node_modules", "src", "."],
  testPathIgnorePatterns: [
    "dist",
  ],
  transform: {
    "node_modules/variables/.+\\.(j|t)sx?$": "ts-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!variables/.*)",
  ],
};