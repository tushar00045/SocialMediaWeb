import React, { useEffect, useState } from 'react'
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
      <div className="w-full py-8 mt-4 text-center">
        <Container>
            <div className="flex flex-wrap">
                <div className="p-2 w-full">
                    <h1 className="text-2xl font-bold hover:text-gray-500">
                        Login to read posts
                    </h1>
                </div>
            </div>
        </Container>
      </div>
    )
  }
  return (
    <div className="w-full max-w-3xl mx-auto">
        {posts.map((post) => (
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
  )
}

export default Home
