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

export default AllPost
