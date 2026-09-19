import React from 'react'
import Profile  from "../components/Profile"
import MyPost from "../components/MyPost"
import Container from '../components/container/Container'
function FullProfile() {
  console.log("Full profile Loaded.")
  return (
    <Container>
      <Profile />
      <MyPost/>
    </Container>
  )
}

export default FullProfile
