import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container ,PostCard} from '../components'
import appwriteService from "../appwrite/config"
import { useDispatch } from 'react-redux';
import { setPosts as setPostsInStore } from '../store/postSlice';
function Home() {
  const [posts, setPosts] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    appwriteService.getPosts().then((posts) => {
      if (posts) {
        setPosts(posts.documents)

        dispatch(setPostsInStore(posts.documents))
      }
    })
  }, [])

  if (posts.length == 0) {
    return (
      <div className="w-full py-10 sm:py-16">
        <Container>
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] surface px-6 py-14 sm:px-12 sm:py-20 text-center animate-rise">
            <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-iris/30 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-60 w-60 rounded-full bg-volt/15 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
                <span className="h-1.5 w-1.5 rounded-full bg-volt" /> A calmer place to share
              </span>
              <h1 className="mt-6 font-display text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-white">
                Login to read <span className="text-gradient">posts</span>
              </h1>
              <p className="mx-auto mt-5 max-w-md text-zinc-400 leading-7">
                Sign in to see what people are sharing, follow creators, and join the conversation.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link to="/login" className="rounded-xl bg-volt px-6 py-3 font-semibold text-black hover:brightness-110 transition shadow-[0_10px_40px_-10px_rgba(212,255,58,0.7)]">
                  Sign in
                </Link>
                <Link to="/signup" className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/[0.06] transition">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    )
  }
  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-0 py-6">
        <div className="mb-5 flex items-end justify-between px-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-volt">Your feed</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">What&apos;s happening</h1>
          </div>
          <Link to="/add-post" className="rounded-xl bg-white/[0.05] border border-white/[0.08] px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-volt hover:text-black transition">
            + Post
          </Link>
        </div>
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
            createdAt={post.$createdAt}
            />
        ))}
    </div>
  )
}

export default Home
