import { isPermissionAllowed } from 'cypress-browser-permissions';

describe('Home page Testing', () => {
    const email = "danilo@email.com";
    const password = "senha123";

    beforeEach(() => {
        cy.viewport('samsung-s10');
        cy.visit('/login');
        cy.get('#email')
            .type(email)
            .get('#password')
            .type(password)
            .get('#submit')
            .click()
    });

    it('should display map', () => {
        cy.get("#map")
            .should('exist')
    });

    it('should geolocation permission', () => {
        expect(isPermissionAllowed("geolocation")).to.be.true;
    });

    it('should marker visible', () => {
        cy.get('#gmimap0')
            .should('exist')
    });
});