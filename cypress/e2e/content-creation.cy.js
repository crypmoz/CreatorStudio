describe('Content Creation Module Tests', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/content');
  });

  it('should load the content creation page correctly', () => {
    cy.url().should('include', '/content');
    cy.get('h2').contains('Content Creation Hub');
    
    // Check tabs exist
    cy.get('[role="tab"]').contains('Templates');
    cy.get('[role="tab"]').contains('Video Editor');
    cy.get('[role="tab"]').contains('AI Ideas');
  });

  it('should display content templates', () => {
    // Templates tab should be active by default
    cy.get('[role="tab"][data-state="active"]').contains('Templates');
    
    // Check if templates are loaded
    cy.get('[role="tabpanel"]').find('.overflow-hidden').should('have.length.at.least', 1);
    
    // Template cards should have title and description
    cy.get('[role="tabpanel"]').find('.overflow-hidden h3').first().should('not.be.empty');
    cy.get('[role="tabpanel"]').find('.overflow-hidden p').first().should('not.be.empty');
  });

  it('should switch between tabs', () => {
    // Click on Video Editor tab
    cy.get('[role="tab"]').contains('Video Editor').click();
    cy.get('[role="tabpanel"][data-state="active"]').contains('Video Preview Area');
    
    // Check if video editor UI elements exist
    cy.get('[role="tabpanel"][data-state="active"]').find('.aspect-video').should('exist');
    cy.get('[role="tabpanel"][data-state="active"]').find('form').should('exist');
    
    // Click on AI Ideas tab
    cy.get('[role="tab"]').contains('AI Ideas').click();
    cy.get('[role="tabpanel"][data-state="active"]').find('input[placeholder*="Search for content ideas"]').should('exist');
    
    // Check if category filters exist
    cy.get('[role="tabpanel"][data-state="active"]').contains('All');
    cy.get('[role="tabpanel"][data-state="active"]').contains('Tutorial');
    cy.get('[role="tabpanel"][data-state="active"]').contains('Lifestyle');
  });

  it('should filter content ideas by category', () => {
    // Go to AI Ideas tab
    cy.get('[role="tab"]').contains('AI Ideas').click();
    
    // Click on a specific category
    cy.get('[role="tabpanel"][data-state="active"]').contains('Tutorial').click();
    
    // Wait for filtering to apply
    cy.wait(500);
    
    // Check if filter is applied (button should have different styling)
    cy.get('button').contains('Tutorial').should('have.class', 'bg-[#FF0050]');
  });

  it('should have a working form in the Video Editor', () => {
    // Switch to Video Editor tab
    cy.get('[role="tab"]').contains('Video Editor').click();
    
    // Fill in the form
    cy.get('form').within(() => {
      cy.get('input[name="title"]').clear().type('Test Video Title');
      cy.get('textarea[name="description"]').clear().type('This is a test video description');
      cy.get('input[name="hashtags"]').clear().type('test, cypress, automation');
      
      // Try to submit the form
      cy.get('button[type="submit"]').click();
    });
    
    // Check for success toast
    cy.contains('Video details saved').should('be.visible');
  });

  it('should create a draft from an idea', () => {
    // Switch to AI Ideas tab
    cy.get('[role="tab"]').contains('AI Ideas').click();
    
    // Find a content idea card
    cy.get('[role="tabpanel"][data-state="active"]')
      .find('.card')
      .first()
      .within(() => {
        // Click Create Draft button
        cy.contains('Create Draft').click();
      });
    
    // Should switch to editor tab automatically
    cy.get('[role="tab"][data-state="active"]').contains('Video Editor');
    
    // Check for success toast
    cy.contains('New content draft created').should('be.visible');
  });
});