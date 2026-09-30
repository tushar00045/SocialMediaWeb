import React, { useState,useEffect} from 'react'
import { PostCard } from '../components'
import Container from "../components/container/Container"
import appwriteService from "../appwrite/config";
import authService from '../appwrite/auth';
import { useSelector,useDispatch } from 'react-redux';
function AllPost() {

  const posts = useSelector((state) => state.post.posts);
  // const dispatch = useDispatch()

  // useEffect(() => {
  //   if (posts.length === 0) {
  //     appwriteService.getPosts().then((res) => {
  //       if (res) {
  //         dispatch(res.documents);
  //       }
  //     })
  //   }
  // }, [dispatch])

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-0 py-6">
      <div className="mb-5 px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-volt">Explore</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">All posts</h1>
        <p className="mt-1 text-sm text-zinc-500">{posts.length} posts from the community</p>
      </div>
      {posts.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 px-6 py-14 text-center text-zinc-500">
          Nothing here yet. Open the Home feed first to load posts.
        </div>
      )}
      {posts.map((post) => (
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
  )
}

export default AllPost
