module.exports = {
  verbose: true,
  rootDir: "",
  testRegex: "/__tests__/.+\\.spec\\.tsx?$",
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/Mock/"
  ],
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleFileExtensions: [
    "js",
    "jsx",
    "ts",
    "tsx",
    "json",
    "node"
  ],
  testURL: "http://localhost"
}
