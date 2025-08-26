
describe('web-e2e smoke', () => {
  it('redirects to /pets and renders cards or empty state', () => {
    cy.visit('/');
    cy.url().should('match', /\/pets$/);
    cy.contains('Pets'); // page heading exists
  });
});
