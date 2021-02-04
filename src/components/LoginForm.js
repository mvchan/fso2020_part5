import React, { useState } from 'react'

const LoginForm = ({initiateLogin}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('') 

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)
        initiateLogin({
            username,
            password
        })
        setUsername('')
        setPassword('')
    }

    return (
        <div>
            <h3>log in to the application</h3>
            <form onSubmit={handleSubmit}>
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
        </div>
    )
}

  export default LoginForm