import React, { useState, useEffect } from 'react'
import appwriteService from "../appwrite/config"
import Container from './container/Container'
import { PostCard } from '.'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
 
function MyPost() {
  const { userId } = useParams();
  
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchPosts = async () => {
      setLoading(true);

      try {
        const result = await appwriteService.getPosts();

        if (result) {
          setAllPosts(result.documents ?? []);
        } else {
          setAllPosts([]);
        }
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId]);

  const myPosts = allPosts.filter(
    (post) => post.userid === userId
  );
  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
        <div className="h-9 w-9 animate-spin rounded-full border-4 border-white/10 border-t-volt" />
        <p className="text-sm text-zinc-400">
          Loading posts...
        </p>
      </div>
    );
  }
 
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
              createdAt={post.$createdAt}
              comments={post.comments}
              viewCount={post.viewCount}
              repostCount={post.repostCount}
              />
          ))}
        </div>
      )}
    </div>
  )
}
 
export default MyPost
 

