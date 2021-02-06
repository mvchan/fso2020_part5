import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login' 
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

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

  const handleLikeUpdate = async (id, blogObject) => {
    try {
      await blogService.update(id,blogObject)
    } catch (exception) {
      setErrorMessage('Could not like blog')
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
          {blogs.filter(blog => blog.user.username === user.username).map(blog => <Blog key={blog.id} blog={blog} sendLike={handleLikeUpdate} />)}
        </div>
      }
    </div>
  )
}

export default App