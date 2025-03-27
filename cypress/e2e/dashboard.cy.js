describe('Dashboard Tests', () => {
  beforeEach(() => {
    cy.login();
  });

  it('should load the dashboard correctly', () => {
    cy.url().should('include', '/dashboard');
    cy.get('h2').contains('Dashboard');
    
    // Verify stats cards are present
    cy.get('[data-testid="stats-card"]').should('have.length.at.least', 3);
    
    // Check if charts loaded
    cy.get('[data-testid="views-chart"]').should('exist');
    cy.get('[data-testid="revenue-chart"]').should('exist');
    
    // Check navigation sidebar
    cy.get('nav').should('exist');
    cy.get('nav').contains('Algorithm');
    cy.get('nav').contains('Content');
    cy.get('nav').contains('Scheduler');
  });

  it('should navigate between modules', () => {
    // Navigate to Algorithm Assistant
    cy.navigateAndVerify('[href="/algorithm"]', '/algorithm', 'h2:contains("Algorithm Assistant")');
    
    // Navigate to Content Creation
    cy.navigateAndVerify('[href="/content"]', '/content', 'h2:contains("Content Creation")');
    
    // Navigate to Scheduler
    cy.navigateAndVerify('[href="/scheduler"]', '/scheduler', 'h2:contains("Scheduler")');
    
    // Navigate to Community Manager
    cy.navigateAndVerify('[href="/community"]', '/community', 'h2:contains("Community Manager")');
    
    // Navigate to Monetization
    cy.navigateAndVerify('[href="/monetization"]', '/monetization', 'h2:contains("Monetization")');
    
    // Navigate to Audience Growth
    cy.navigateAndVerify('[href="/audience"]', '/audience', 'h2:contains("Audience Growth")');
    
    // Navigate back to Dashboard
    cy.navigateAndVerify('[href="/dashboard"]', '/dashboard', 'h2:contains("Dashboard")');
  });

  it('should show user data in the header', () => {
    cy.get('[data-testid="user-profile"]').should('exist');
    cy.get('[data-testid="user-profile"]').contains('Sarah Johnson');
  });

  it('should load and display analytics data', () => {
    // Check if analytics data is loaded
    cy.get('[data-testid="followers-count"]').should('not.be.empty');
    cy.get('[data-testid="views-count"]').should('not.be.empty');
    cy.get('[data-testid="revenue-amount"]').should('not.be.empty');
  });
});