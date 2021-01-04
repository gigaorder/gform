const { defaults } = require('jest-config');

module.exports = {
  verbose: true,
  preset: defaults.preset,
  testMatch: [ "**/test/jest/**/*.test.js", ],
  moduleFileExtensions: [
    "js",
    "json",
    "vue",
  ],
  transform: {
    ".*\\.(vue)$": "vue-jest",
    ".*\\.(js)$": "babel-jest",
  },
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/test/jest/jest-style-mock.js',
  }
}
