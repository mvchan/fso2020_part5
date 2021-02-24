import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import { cloneDeep } from 'lodash'

const App = () => {
    const [normalMessage, setNormalMessage] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)

    const blogFormRef = useRef()

    //empty array will result in only executing once on first-time render
    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
    }, [])

    //empty array will result in only executing once on first-time render
    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (loginObject) => {
        try {
            const user = await loginService.login(loginObject)

            //allows login to persist on re-render
            window.localStorage.setItem(
                'loggedBlogAppUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
        } catch (exception) {
            setErrorMessage('wrong username or password')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const handleBlogCreation = async (blogObject) => {
        try {
            const blog = await blogService.create(blogObject)
            blogFormRef.current.toggleVisibility()
            setBlogs(blogs.concat(blog))
            setNormalMessage(`a new blog titled '${blog.title}' by ${blog.author} has been added`)
            setTimeout(() => {
                setNormalMessage(null)
            }, 5000)
        } catch (exception) {
            setErrorMessage('Could not create new blog')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const handleLikeOperation = async (id, blogObject) => {
        try {
            await blogService.update(id,blogObject)

            //deep copy from lodash needed to maintain proper React state usage by manipulating a copy instead
            const blogsCopy = cloneDeep(blogs)
            blogsCopy[blogsCopy.findIndex(a => a.id === id)].likes = blogObject.likes
            setBlogs(blogsCopy)

        } catch (exception) {
            setErrorMessage('Could not like blog')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const handleDeleteOperation = async (blog) => {
        try {
            if (!window.confirm(`Remove blog '${blog.title}' by ${blog.author}?`))
                return

            await blogService.remove(blog.id)

            //deep copy from lodash needed to maintain proper React state usage by manipulating a copy instead
            const blogsCopy = cloneDeep(blogs)
            blogsCopy.splice(blogsCopy.findIndex(a => a.id === blog.id),1)
            setBlogs(blogsCopy)

            setNormalMessage(`the blog titled '${blog.title}' by ${blog.author} has been deleted`)
            setTimeout(() => {
                setNormalMessage(null)
            }, 5000)
        } catch (exception) {
            setErrorMessage('Could not delete blog')
            setTimeout(() => {
                setErrorMessage(null)
            }, 5000)
        }
    }

    const loginForm = () => (
        <Togglable buttonLabel='login'>
            <LoginForm initiateLogin={handleLogin} />
        </Togglable>
    )

    const blogForm = () => (
        <Togglable buttonLabel='create new blog' ref={blogFormRef}>
            <BlogForm createBlog={handleBlogCreation} />
        </Togglable>
    )

    return (
        <div>
            <h2>Blogs</h2>
            {user === null
                ?
                <div>
                    <Notification message={errorMessage} isError={true} />
                    {loginForm()}
                </div>
                :
                <div>
                    <Notification message={normalMessage} isError={false} />
                    <Notification message={errorMessage} isError={true} />
                    <p>{user.name} logged in
                        <button onClick={() => {
                            window.localStorage.removeItem('loggedBlogAppUser')
                            setUser(null)
                        }
                        }>logout
                        </button>
                    </p>
                    {blogForm()}
                    <div id='blog-list'>
                        {blogs.sort((a,b) => b.likes - a.likes)
                            .sort((x,y) => x.title.toLowerCase() - y.title.toLowerCase())
                            .map(blog => <Blog key={blog.id} blog={blog} user={user} likeOperation={handleLikeOperation} deleteOperation={handleDeleteOperation} />)}
                    </div>
                </div>
            }
        </div>
    )
}

export default App