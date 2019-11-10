describe('Demo page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('successfully loads', () => {
    cy.get('.scrollable-wrapper li', { timeout: 10000 })
      .should('have.length', 4);
  });

  it('adds new elements', () => {
    cy.contains('Add Item').click();

    cy.get('.scrollable-wrapper li')
      .should('have.length', 5);
  });

  it('scrolls automatically', () => {
    cy.contains('Add Item')
      .click()
      .click()
      .click()
      .click();

    cy.get('.scrollable-wrapper li')
      .last()
      .should('be.visible');
    cy.get('.scrollable-wrapper li')
      .first()
      .should('not.be.visible');
  });
})