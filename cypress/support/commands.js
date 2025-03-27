// ***********************************************
// This commands.js file allows you to create custom commands
// and overwrite existing commands.
// ***********************************************

// Add custom login command
Cypress.Commands.add('login', (username = 'demo', password = 'password123') => {
  cy.visit('/');
  // Mock the login for testing - in a real app you would have a login form
  cy.window().then((win) => {
    win.localStorage.setItem('user', JSON.stringify({ 
      id: 1, 
      username: 'demo', 
      displayName: 'Sarah Johnson'
    }));
  });
  cy.visit('/dashboard');
});

// Add navigation command to verify page transition
Cypress.Commands.add('navigateAndVerify', (linkSelector, expectedUrl, expectedElement) => {
  cy.get(linkSelector).click();
  cy.url().should('include', expectedUrl);
  if (expectedElement) {
    cy.get(expectedElement).should('exist');
  }
});

// Add command to check if data is loaded in a container
Cypress.Commands.add('containsData', (selector) => {
  cy.get(selector)
    .should('exist')
    .and('not.have.text', '')
    .and('be.visible');
});

// Wait for API calls to complete and content to load
Cypress.Commands.add('waitForContentLoad', () => {
  cy.intercept('GET', '/api/**').as('apiCall');
  cy.wait('@apiCall', { timeout: 10000 });
});