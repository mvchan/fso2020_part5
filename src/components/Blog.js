import React, { useState } from 'react'
const Blog = ({ blog, sendLike }) => {
  const [visible, setVisible] = useState(false)
  const [likeCount, setLikeCount] = useState(blog.likes)

  const view = { display: visible ? 'none' : '' }
  const hide = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  //using async/await in order to synchronize likes being shown with actual like count
  const addLike = async () => {
    
    await sendLike(blog.id,{
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: likeCount+1,
      user: blog.user.id
    })

    setLikeCount(likeCount+1)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={view}> 
        {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button> 
      </div>
      <div style={hide}>  
        {blog.title} {blog.author} <button onClick={toggleVisibility}>hide</button><br/>
        {blog.url}<br/>
        likes {likeCount} <button onClick={addLike}>like</button><br/>
        {blog.user.name}<br/>
      </div>
    </div>
  )
}

export default Blog
