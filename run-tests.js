const { execSync } = require('child_process');

// Execute Jest tests
console.log('Running Jest tests...');
try {
  execSync('npx jest', { stdio: 'inherit' });
  console.log('Tests completed successfully!');
} catch (error) {
  console.error('Tests failed:', error.message);
  process.exit(1);
}