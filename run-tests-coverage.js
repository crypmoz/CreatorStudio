const { execSync } = require('child_process');

// Execute Jest tests with coverage
console.log('Running Jest tests with coverage...');
try {
  execSync('npx jest --coverage', { stdio: 'inherit' });
  console.log('Coverage tests completed successfully!');
} catch (error) {
  console.error('Coverage tests failed:', error.message);
  process.exit(1);
}