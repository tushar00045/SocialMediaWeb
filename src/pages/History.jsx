import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PostCard } from "../components";
import appwriteRepost from "../appwrite/repostConfig";
import { useParams ,useNavigate} from "react-router-dom";
import appwriteService from "../appwrite/config";
import appwriteHistory from "../appwrite/historyConfig";
function History() {
  const [bookMarkPosts, setBookmarkPost] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const userData = useSelector((state) => state.auth.userData);

  
  useEffect(() => {
    if (!userData?.$id) return;

    const fetchData = async () => {
        setLoading(true);

        try {
          const [bookmarkResult, postResult] = await Promise.all([
                appwriteHistory.getHistoryUsers(userData?.$id),
                appwriteService.getPosts(),
            ]);

            setBookmarkPost(bookmarkResult?.documents ?? []);
            setAllPosts(postResult?.documents ?? []);
        } catch (error) {
            console.error("Failed to fetch bookMark Post:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, [userData?.$id]);

    
  const bookMarkedPosts = bookMarkPosts
    .map((bookMark) => {
      const originalPost = allPosts.find(
        (post) => post.$id === bookMark.postId
      );

      if (!originalPost) return null;

      return {
        ...originalPost,
        bookMarkId: bookMark.$id,
      };
    })
    .filter(Boolean);
  
  if (loading) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
              <div className="surface w-full max-w-md rounded-3xl border border-white/10 p-10 text-center shadow-xl">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-volt/10">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-volt" />
                  </div>

                  <h2 className="text-xl font-bold text-white">
                      Loading History
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                      Gathering the posts you've saved. Just a moment...
                  </p>

                  <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div className="h-full w-1/2 animate-pulse rounded-full bg-volt" />
                  </div>
              </div>
          </div>
      );
  }

  if (bookMarkedPosts.length === 0) {
      return (
          <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
              <div className="surface w-full max-w-md rounded-3xl border border-white/10 p-8 text-center shadow-xl sm:p-10">
                  <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-volt/20 bg-volt/10">
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-volt"
                      >
                          <path d="m17 2 4 4-4 4" />
                          <path d="M3 11V9a3 3 0 0 1 3-3h15" />
                          <path d="m7 22-4-4 4-4" />
                          <path d="M21 13v2a3 3 0 0 1-3 3H3" />
                      </svg>
                  </div>

                  <h2 className="font-display text-2xl font-bold tracking-tight text-white">
                      Nothing Saved yet
                  </h2>

                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-zinc-400">
                      When you BookMark something interesting, it will appear here.
                      Find a post worth sharing and let others discover it too.
                  </p>

                  <button
                      type="button"
                      onClick={() => navigate("/all-posts")}
                      className="mt-7 inline-flex items-center justify-center rounded-xl bg-volt px-6 py-3 text-sm font-semibold text-black transition hover:brightness-110 active:scale-[0.98]"
                  >
                      Explore posts
                      <span className="ml-2" aria-hidden="true">→</span>
                  </button>

                  <p className="mt-5 text-xs text-zinc-600">
                      Your BookMarked posts will live here.
                  </p>
              </div>
          </div>
      );
  }
  
  return(
    <div className="w-full max-w-2xl mx-auto px-3 py-6">
      {bookMarkedPosts.map((post) => (
        <PostCard
          key={post.repostId}
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
          onUnrepost={() => handleUnrepost(post.repostId)}
        />
      ))}
    </div>
  );
}

export default History;