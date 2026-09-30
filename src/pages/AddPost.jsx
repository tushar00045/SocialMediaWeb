import React from 'react'
import { Container } from '../components'
import PostForm from "../components/PostForm/PostForm"
function AddPost() {
  return (
    <div className='py-6 sm:py-10'>
      <Container>
        <PostForm/>
      </Container>
    </div>
  )
}

export default AddPost
