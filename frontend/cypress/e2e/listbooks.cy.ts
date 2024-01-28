describe("Liste des livres", () => {
  it("Test de redirection si pas connecté", () => {
    cy.visit("http://localhost:3000/books/list");
    cy.url().should("eq", "http://localhost:3000/auth/login");
  });
});
