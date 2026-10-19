import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import appwriteService from "../appwrite/config";
import {
    setPosts as setPostsInStore,
    setfeed,
    setExplore,
} from "../store/postSlice";
import { PostCard } from "../components";

function AllPost() {
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.auth.userData);
    const posts = useSelector((state) => state.post.posts);
    const explorePosts = useSelector((state) => state.post.explore);

    const [loading, setLoading] = useState(posts.length === 0);

    useEffect(() => {
        let cancelled = false;

        const loadPosts = async () => {
            // Posts are already available in Redux.
            if (posts.length > 0) {
                setLoading(false);
                return;
            }

            setLoading(true);

            try {
                const result = await appwriteService.getPosts();

                if (cancelled || !result) return;

                const otherUsersPosts = result.documents.filter(
                    (post) => post.userid !== userData?.$id
                );

                const shuffled = [...otherUsersPosts];

                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [
                        shuffled[j],
                        shuffled[i],
                    ];
                }

                const mid = Math.ceil(shuffled.length / 2);

                const feed = shuffled.slice(0, mid);
                const explore = shuffled.slice(mid);

                const newestFirst = (a, b) =>
                    new Date(b.$createdAt) - new Date(a.$createdAt);

                feed.sort(newestFirst);
                explore.sort(newestFirst);

                dispatch(setPostsInStore(otherUsersPosts));
                dispatch(setfeed(feed));
                dispatch(setExplore(explore));
            } catch (error) {
                console.error("Failed to load Explore posts:", error);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        loadPosts();

        return () => {
            cancelled = true;
        };
    }, [dispatch, posts.length, userData?.$id]);

    if (loading) {
        return (
            <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
                <div className="h-9 w-9 animate-spin rounded-full border-4 border-white/10 border-t-volt" />
                <p className="text-sm text-zinc-400">
                    Loading Explore posts...
                </p>
            </div>
        );
    }

    if (explorePosts.length === 0) {
        return (
            <div className="px-4 py-16 text-center">
                <h2 className="text-xl font-bold text-white">
                    No posts to explore yet
                </h2>
                <p className="mt-2 text-sm text-zinc-400">
                    New posts from other creators will appear here.
                </p>
            </div>
        );
    }

    return (
      <div className="mx-auto w-full max-w-2xl px-3 py-6">
        <div className="mb-5 px-1">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-volt">Explore</p>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tight text-white">All posts</h1>
          <p className="mt-1 text-sm text-zinc-500">{explorePosts.length} posts from the community</p>
        </div>
            {explorePosts.map((post) => (
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
    );
}

export default AllPost;