import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'
import BlogForm from './BlogForm'
import Togglable from './Togglable'

test('renders content', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Jest',
        url: 'test.url',
        likes: '989',
        user: 'testing'
    }

    const component = render(
        <Blog blog={blog} />
    )

    //const divComp = component.container.querySelector('div')
    //console.log(prettyDOM(divComp))

    component.debug()

    //method 1
    expect(component.container).toHaveTextContent(
        'Component testing is done with react-testing-library'
    )

    const blogViewDiv = component.container.querySelector('.blogView')
    expect(blogViewDiv).not.toHaveStyle('display: none')
    expect(blogViewDiv).not.toHaveTextContent('likes')

    const blogHideDiv = component.container.querySelector('.blogHide')
    expect(blogHideDiv).toHaveStyle('display: none')
    expect(blogHideDiv).toHaveTextContent('likes')

    // method 2
    //const element = component.getByText(
    //    'Component testing is done with react-testing-library'
    //)
    //expect(element).toBeDefined()

    // method 3
    //const div = component.container.querySelector('.blog')
    //expect(div).toHaveTextContent(
    //    'Component testing is done with react-testing-library'
    //)
})

/*
test('clicking the view button calls event handler once', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'Jest',
        url: 'test.url',
        likes: '989',
        user: {
            username: 'jestTestUser'
        }
    }

    const user = {
        username: 'jestTestUser'
    }

    const mockHandler = jest.fn()

    const component = render(
        <Blog blog={blog} user={user} likeOperation={mockHandler} deleteOperation={mockHandler} />
    )

    const button = component.getByText('view')
    fireEvent.click(button)

    expect(mockHandler.mock.calls).toHaveLength(1)
})

describe('<Togglable />', () => {
    let component

    beforeEach(() => {
        component = render(
            <Togglable buttonLabel="show...">
                <div className="testDiv" />
            </Togglable>
        )
    })

    test('renders its children', () => {
        expect(
            component.container.querySelector('.testDiv')
        ).toBeDefined()
    })

    test('at start the children are not displayed', () => {
        const div = component.container.querySelector('.togglableContent')

        expect(div).toHaveStyle('display: none')
    })

    test('after clicking the button, children are displayed', () => {
        const button = component.getByText('show...')
        fireEvent.click(button)

        const div = component.container.querySelector('.togglableContent')
        expect(div).not.toHaveStyle('display: none')
    })

    test('toggled content can be closed', () => {
        const button = component.getByText('show...')
        fireEvent.click(button)

        const closeButton = component.getByText('cancel')
        fireEvent.click(closeButton)

        const div = component.container.querySelector('.togglableContent')
        expect(div).toHaveStyle('display: none')
    })
})

test('<BlogForm /> updates parent state and calls onSubmit', () => {
    const createBlog = jest.fn()

    const component = render(
        <BlogForm createBlog={createBlog} />
    )

    const input = component.container.querySelector('input')
    const form = component.container.querySelector('form')

    fireEvent.change(input, {
        target: { value: 'testing of forms could be easier' }
    })
    fireEvent.submit(form)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].content).toBe('testing of forms could be easier' )
})
*/