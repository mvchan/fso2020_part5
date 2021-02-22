//It is recommended that arrow functions are not used, because they might cause some issues in certain situations.

describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3001/api/testing/reset')
        const user = {
            name: 'Mark Test',
            username: 'mac10test',
            password: 'pass456test'
        }
        cy.request('POST', 'http://localhost:3001/api/users/', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.contains('Blogs')
        cy.contains('login')
    })

    describe('Login',function() {
        it('succeeds with correct credentials', function() {
            cy.contains('login').click()
            cy.get('#username').type('mac10test')
            cy.get('#password').type('pass456test')
            cy.get('#login-button').click()
            cy.contains('Mark Test logged in')
        })

        it('fails with wrong credentials', function() {
            cy.contains('login').click()
            cy.get('#username').type('unknown')
            cy.get('#password').type('unknown')
            cy.get('#login-button').click()

            cy.get('.error').should('contain', 'wrong username or password')
                .and('have.css', 'color', 'rgb(255, 0, 0)')
                .and('have.css', 'border-style', 'solid')

            cy.get('html').should('not.contain', 'Mark Test logged in')
        })
    })

    // it('login form can be opened', function() {
    //     cy.visit('http://localhost:3000')
    //     cy.contains('login').click()
    // })

    // it('user can log in', function() {
    //     cy.contains('login').click()
    //     cy.get('#username').type('mac10')
    //     cy.get('#password').type('pass456')
    //     cy.get('#login-button').click()
    //     cy.contains('Mark logged in')
    // })

    // describe('when logged in', function() {
    //     beforeEach(function() {
    //         /*
    //         cy.contains('login').click()
    //         cy.get('input:first').type('mac10')
    //         cy.get('input:last').type('pass456')
    //         cy.get('#login-button').click()
    //         */

    //         cy.login({ username: 'mac10', password: 'pass456' })
    //     })

    //     it('a new blog can be created', function() {
    //         /*
    //         cy.contains('create new blog').click()
    //         cy.get('#title').type('cypress blog title')
    //         cy.get('#author').type('cypress blog author')
    //         cy.get('#url').type('cypress blog url')
    //         cy.contains('create').click()
    //         cy.contains('cypress blog title')
    //         */
    //         cy.createBlog({
    //             title:'cypress blog title',
    //             author:'cypress blog author',
    //             url:'cypress blog url'
    //         })
    //     })
    // })

    // it.only('login fails with wrong password', function() {
    //     cy.contains('login').click()
    //     cy.get('#username').type('mac10')
    //     cy.get('#password').type('pass456')
    //     cy.get('#login-button').click()

    //     cy.get('.error').should('contain', 'wrong username or password')
    //         .and('have.css', 'color', 'rgb(255, 0, 0)')
    //         .and('have.css', 'border-style', 'solid')

    //     cy.get('html').should('not.contain', 'Mark logged in')
    // })
})