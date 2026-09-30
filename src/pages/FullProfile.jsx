import React from 'react'
import Profile  from "../components/Profile"
import MyPost from "../components/MyPost"
import Container from '../components/container/Container'
function FullProfile() {
  console.log("Full profile Loaded.")
  return (
    <Container>
      <div className="pb-6">
        <Profile />
        <div className="mx-auto max-w-3xl">
          <MyPost/>
        </div>
      </div>
    </Container>
  )
}

export default FullProfile
