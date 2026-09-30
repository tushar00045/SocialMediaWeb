import React, { useState, useEffect } from 'react'
import appwriteService from "../appwrite/config"
import Container from './container/Container'
import { PostCard } from '.'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
 
function MyPost() {
  const userData = useSelector(state => state.auth.userData);
 
  // All hooks are called first (React requires hooks to run in the same order on every render)
  const { userId } = useParams();
 
  const Allposts = useSelector((state) => state.post.posts);
 
  if (!userData) {
    return;
  }
 
  const myPosts = Allposts.filter(post => post.userid === userId);
 
  return (
    <div className="w-full pt-2">
      {myPosts.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-white/10 px-6 py-14 text-center animate-rise">
          <div className="mx-auto mb-4 h-12 w-12 rounded-2xl bg-linear-to-br from-volt/30 to-iris/30" />
          <p className="font-display text-lg font-semibold text-white">No posts yet</p>
          <p className="mt-1 text-sm text-zinc-500">When posts are shared, they&apos;ll show up here.</p>
        </div>
      ) : (
        <div className="grid gap-0">
          {myPosts.map((post) => (
              <PostCard
                  key={post.$id}
                  $id={post.$id}
                  title={post.title}
                  content={post.content}
                  featuredImage={post.featuredImage}
                  userid={post.userid}
                  userName={post.userName}
                  likes={post.likes}
              />
          ))}
        </div>
      )}
    </div>
  )
}
 
export default MyPost
 

