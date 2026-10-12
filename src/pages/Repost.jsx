import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PostCard } from "../components";
import appwriteRepost from "../appwrite/repostConfig";

function Repost() {
  const [reposts, setReposts] = useState([]);

  const userData = useSelector((state) => state.auth.userData);
  const allPosts = useSelector((state) => state.post.posts);

  useEffect(() => {
    const fetchReposts = async () => {
      if (!userData?.$id) return;

      const result = await appwriteRepost.getRepostsUsers(
        userData.$id
      );

      if (result) {
        setReposts(result.documents);
      }
    };

    fetchReposts();
  }, [userData?.$id]);

  const repostedPosts = reposts
    .map((repost) => {
      const originalPost = allPosts.find(
        (post) => post.$id === repost.postId
      );

      if (!originalPost) return null;

      return {
        ...originalPost,
        repostId: repost.$id,
      };
    })
    .filter(Boolean);

  return (
    <div className="w-full max-w-2xl mx-auto px-3 py-6">
      {repostedPosts.map((post) => (
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
        />
      ))}
    </div>
  );
}

export default Repost;