import React, { useState,useEffect} from 'react'
import { PostCard } from '../components'
import Container from "../components/container/Container"
import appwriteService from "../appwrite/config";
import authService from '../appwrite/auth';
import { useSelector,useDispatch } from 'react-redux';
function AllPost() {

  // const posts = useSelector((state) => state.post.posts);
  const explore = useSelector((state) => state.post.explore);

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-0 py-6">
      <div className="mb-5 px-1">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-volt">Explore</p>
        <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">All posts</h1>
        <p className="mt-1 text-sm text-zinc-500">{explore.length} posts from the community</p>
      </div>
      {explore.length === 0 && (
        <div className="rounded-3xl border border-dashed border-white/10 px-6 py-14 text-center text-zinc-500">
          Nothing here yet. Open the Home feed first to load posts.
        </div>
      )}
      {explore.map((e) => (
            <PostCard
                key={e.$id}
                $id={e.$id}
                title={e.title}
                content={e.content}
                featuredImage={e.featuredImage}
                userid={e.userid}
          userName={e.userName}
          likes={e.likes}
          createdAt={e.$createdAt}
          comments={e.comments}
          viewCount={e.viewCount}
            />
        ))}
    </div>
  )
}

export default AllPost
