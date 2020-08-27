// SPDX-FileCopyrightText: 2020 tech@factchecklab <tech@factchecklab.org>
//
// SPDX-License-Identifier: AGPL-3.0-or-later

module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['js'],
  transformIgnorePatterns: ['/node_modules/'],
  testMatch: [
    '<rootDir>/**/__tests__/**/*.js',
    '<rootDir>/**/*.{spec,test}.js',
  ],
};
