// This file contains test setup configuration
// It is imported in jest.config.js as setupFilesAfterEnv

// Extend Jest's expect:
import { expect } from '@jest/globals';

// Configure timeout if needed
jest.setTimeout(30000); // 30 seconds

// Global beforeAll/afterAll hooks can be added here
beforeAll(() => {
  console.log('Starting test suite...');
});

afterAll(() => {
  console.log('Test suite completed.');
});

// Reset storage between tests if needed
beforeEach(() => {
  // Clear mocks or reset test state if needed
});

afterEach(() => {
  // Clear any side effects from tests
  jest.clearAllMocks();
});