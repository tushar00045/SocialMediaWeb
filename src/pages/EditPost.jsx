import React,{useEffect,useState} from 'react'
import { Container, PostForm } from '../components';
import appwriteService from "../appwrite/config";
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentPost } from '../store/postSlice';
function EditPost() {
  const [post, setPost] = useState(null);
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch();

  
  useEffect(() => {
    if (slug) {
      appwriteService.getPost(slug).then((post) => {
        if (post) {
          setPost(post)

          dispatch(setCurrentPost(post))
        }
      })
    }
    else {
      navigate('/')
    }
  },[slug,navigate])
  return post ? (
    <div className='py-8'>
      <Container>
        <PostForm post={post}/>
      </Container>
  </div>
  ):null
}

export default EditPost
