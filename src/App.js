import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login' 

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [normalMessage, setNormalMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setURL] = useState('')

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

  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)  

    try {
      const user = await loginService.login({
        username,
        password
      })

      //allows login to persist on re-render
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleBlogCreation = async (event) => {
    event.preventDefault()
    console.log('adding a new blog')

    try {
      const blog = await blogService.create({
        title,
        author,
        url
      })
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

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
          <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
          <input type="password" value={password} name="Password" onChange={({ target }) => setPassword(target.value)} />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const blogForm = () => (
    <form onSubmit={handleBlogCreation}>
        <div>title: <input value={title} onChange={({target}) => setTitle(target.value)} /></div>
        <div>author: <input value={author} onChange={({target}) => setAuthor(target.value)} /></div>
        <div>url: <input value={url} onChange={({target}) => setURL(target.value)} /></div>
        <div><button type="submit">create</button></div>
    </form>
  )

  return (
    <div>
      {user === null 
        ?
        <div>
          <h2>log in to application</h2>
          <Notification message={errorMessage} isError={true} />
          {loginForm()}
        </div> 
        :
        <div>
          <h2>blogs</h2>
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
          <h2>create new</h2>
          {blogForm()}
          {blogs.filter(blog => blog.user.username === user.username).map(blog => <Blog key={blog.id} blog={blog} />)}
        </div>
      }
    </div>
  )
}

export default App