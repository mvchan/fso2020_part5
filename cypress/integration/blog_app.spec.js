//It is recommended that arrow functions are not used, because they might cause some issues in certain situations.

describe('Blog app', function() {
    beforeEach(function() {
        cy.visit('http://localhost:3000')
    })

    it('front page can be opened', function() {
        cy.visit('http://localhost:3000')
        cy.contains('Blogs')
        cy.contains('login')
    })

    it('login form can be opened', function() {
        cy.visit('http://localhost:3000')
        cy.contains('login').click()
    })

    it('user can log in', function() {
        cy.contains('login').click()
        cy.get('#username').type('mac10')
        cy.get('#password').type('pass456')
        cy.get('#login-button').click()
        cy.contains('Mark logged in')
    })

    describe('when logged in', function() {
        beforeEach(function() {
            cy.contains('login').click()
            cy.get('input:first').type('mac10')
            cy.get('input:last').type('pass456')
            cy.get('#login-button').click()
        })

        it('a new blog can be created', function() {
            cy.contains('create new blog').click()
            cy.get('#title').type('cypress blog title')
            cy.get('#author').type('cypress blog author')
            cy.get('#url').type('cypress blog url')
            cy.contains('create').click()
            cy.contains('cypress blog title')
        })
    })
})