describe('Login page Testing', () => {
    const email = "danilo@email.com";
    const password = "senha123";

    beforeEach(() => {
        cy.viewport('samsung-s10');
        cy.visit('/login');
    });

    it('should display form', () => {
        cy.contains('E-mail');
        cy.contains('Senha');
        cy.contains('Entrar');
    });

    it('should show email input errors', () => {
        cy.get('#email')
            .click()
            .get('#password')
            .click()
            .get(".validation-error-email")
            .should('be.visible')

        cy.get('#email')
            .type(email.replace(".", ""))
            .get(".validation-error-email")
            .should('be.visible')
    });

    it('should show password input errors', () => {
        cy.get('#password')
            .click()
            .get('#email')
            .click()
            .get(".validation-error-password")
            .should('be.visible')
    });

    it('should submit form', () => {
        cy.get('#email')
            .type(email)
            .should('have.value', email)
            .get('#password')
            .type(password)
            .should('have.value', password)

        cy.get('#submit')
            .should('not.have.class', 'button-disabled')
            .click()
            .wait(2000)

        cy.get("#map")
            .should('exist')
    })
});