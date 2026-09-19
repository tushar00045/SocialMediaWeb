import React, { useState, useEffect } from 'react'
import appwriteService from "../appwrite/config"
import Container from './container/Container'
import { PostCard } from '.'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

function MyPost() {
  const userData = useSelector(state => state.auth.userData);

  if (!userData) {
    return;
  }

  const { userId } = useParams();

  const Allposts = useSelector((state) => state.post.posts);

  const myPosts = Allposts.filter(post => post.userid === userId);
  
  return (
    <Container>
      <div className="w-full max-w-3xl mx-auto">
          {myPosts.map((post) => (
              <PostCard
                  key={post.$id}
                  $id={post.$id}
                  title={post.title}
                  content={post.content}
                  featuredImage={post.featuredImage}
                  userid={post.userid}
                  userName={post.userName}
              />
          ))}
      </div>
    </Container>
  )
}

export default MyPost
