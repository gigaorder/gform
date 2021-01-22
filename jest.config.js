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
    '^.*\\.vue$': "vue-jest",
    '^.+\\.js$': "<rootDir>/node_modules/babel-jest",
    ".+\\.(css|styl|less|sass|scss|png|jpg|svg|ttf|woff|woff2)$": "<rootDir>/node_modules/jest-transform-stub"
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!pos-vue-framework)",
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/test/jest/jest-style-mock.js',
  },
  snapshotSerializers: ['jest-serializer-html'],
}
