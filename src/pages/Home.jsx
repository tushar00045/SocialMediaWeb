import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Container ,PostCard} from '../components'
import appwriteService from "../appwrite/config"
import { useDispatch,useSelector } from 'react-redux';
import { setPosts as setPostsInStore, setfeed, setExplore } from '../store/postSlice';

function Home() {
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const userData = useSelector((state) => state.auth.userData);
  const dispatch = useDispatch();

  function shuffleArray(array) {
    const shuffled = [...array];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }
/*
  useEffect(() => {
      if (!userData?.$id) return;

      const fetchPosts = async () => {
        const result = await appwriteService.getPosts();

        if (result) {
            // Exclude the logged-in user's posts.
            const otherUsersPosts = result.documents.filter(
                (post) => post.userid !== userData.$id
            );

            dispatch(setPostsInStore(otherUsersPosts));

            const shuffledPosts = shuffleArray(otherUsersPosts);

            // Divide into two groups.
            const mid = Math.ceil(shuffledPosts.length / 2);

            const feedPosts = shuffledPosts.slice(0, mid);
            const explorePosts = shuffledPosts.slice(mid);

            // Sort each group: newest first.
            const newestFirst = (a, b) =>
                new Date(b.$createdAt) - new Date(a.$createdAt);

            feedPosts.sort(newestFirst);
            explorePosts.sort(newestFirst);

            dispatch(setfeed(feedPosts));
            dispatch(setExplore(explorePosts));
        }
      };

      fetchPosts();
  }, [dispatch, userData?.$id]);
*/
  
  useEffect(() => {
      let cancelled = false;

      const fetchPosts = async () => {
          if (!userData?.$id) {
              setLoading(false);
              return;
          }

          setLoading(true);
          setFetchError("");

          try {
              const result = await appwriteService.getPosts();

              if (cancelled) return;

              if (!result) {
                  throw new Error("Failed to fetch posts");
              }

              const otherUsersPosts = result.documents.filter(
                  (post) => post.userid !== userData.$id
              );

              dispatch(setPostsInStore(otherUsersPosts));

              const shuffledPosts = shuffleArray(otherUsersPosts);
              const mid = Math.ceil(shuffledPosts.length / 2);

              const feedPosts = shuffledPosts.slice(0, mid);
              const explorePosts = shuffledPosts.slice(mid);

              const newestFirst = (a, b) =>
                  new Date(b.$createdAt) - new Date(a.$createdAt);

              feedPosts.sort(newestFirst);
              explorePosts.sort(newestFirst);

              dispatch(setfeed(feedPosts));
              dispatch(setExplore(explorePosts));
          } catch (error) {
              if (!cancelled) {
                  console.error("Failed to fetch posts:", error);
                  setFetchError("Unable to load posts. Please try again.");
              }
          } finally {
              if (!cancelled) {
                  setLoading(false);
              }
          }
      };

      fetchPosts();

      return () => {
          cancelled = true;
      };
  }, [dispatch, userData?.$id]);

  const feed = useSelector((state) => state.post.feed);
  
  if (!userData?.$id) {
    return (
      <div className="w-full py-10 sm:py-16">
        <Container>
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-4xl surface px-6 py-14 sm:px-12 sm:py-20 text-center animate-rise">
            <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-iris/30 blur-3xl" />
            <div className="absolute -bottom-24 right-0 h-60 w-60 rounded-full bg-volt/15 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3 py-1 text-xs font-medium text-zinc-300">
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
                <Link to="/signup" className="rounded-xl border border-white/15 px-6 py-3 font-semibold text-white hover:bg-white/6 transition">
                  Create account
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>
    )
  }

  if (loading) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
              <div className="surface w-full max-w-md rounded-3xl border border-white/10 p-10 text-center shadow-xl">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-volt/10">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-volt" />
                  </div>

                  <h2 className="text-xl font-bold text-white">
                      Your feed is loading
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                     Fetching the latest posts. Just a moment!
                  </p>

                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-1/2 animate-pulse rounded-full bg-volt" />
                  </div>
              </div>
          </div>
      );
  }

  if (feed.length === 0) {
    return (
      <Container>
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-200 bg-white px-6 py-12 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900 sm:px-10">
            {/* Empty state illustration */}
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-indigo-50 dark:bg-indigo-950/50">
              <svg
                className="h-10 w-10 text-indigo-600 dark:text-indigo-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10h8M8 14h5m-8 6 3-3h9a3 3 0 0 0 3-3V6a3 3 0 0 0-3-3H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3v3Z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
              Your feed is feeling quiet
            </h2>

            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              There are no posts to show right now. Discover new people or
              publish something of your own to get the conversation started.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/all-posts")}
                className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98]"
              >
                Explore posts
              </button>

              <button
                onClick={() => navigate("/add-post")}
                className="rounded-xl border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 active:scale-[0.98] dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                Create a post
              </button>
            </div>
          </div>
        </div>
      </Container>
    );
  }


  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-0 py-6">
        <div className="mb-5 flex items-end justify-between px-1">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-volt">Your feed</p>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">What&apos;s happening</h1>
          </div>
          <Link to="/add-post" className="rounded-xl bg-white/5 border border-white/8 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-volt hover:text-black transition">
            + Post
          </Link>
        </div>
        {feed.map((f) => (
            <PostCard
                key={f.$id}
                $id={f.$id}
                title={f.title}
                content={f.content}
                featuredImage={f.featuredImage}
                userid={f.userid}
                userName={f.userName}
            likes={f.likes}
            createdAt={f.$createdAt}
            comments={f.comments}
            viewCount={f.viewCount}
            repostCount={f.repostCount}
            />
        ))}
    </div>
  )
}

export default Home
