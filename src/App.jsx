import { useEffect, useState } from 'react'
import './App.css'
import { useDispatch } from 'react-redux';
import authService from './appwrite/auth';
import { login, logout } from "./store/authSlice"
import { Header, Footer } from "./components/index"
import { Outlet } from 'react-router-dom';
import profileAppwrite from './appwrite/profileConfig';
import { setprofiles } from './store/profileSlice';
function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()
  
  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login({userData}))
        }
        else {
          dispatch(logout())
        }
      })
      .finally(()=>setLoading(false))
  }, [])
  
  useEffect(() => {
    const fetchProfiles = async() => {
      try {
        const result = await profileAppwrite.getProfiles();
        if (result) {
          dispatch(setprofiles(result.documents));
        }
      } catch (error) {
        console.error("Failed To fetch profiles:", error);
      }
    }
    fetchProfiles();
  },[dispatch])

  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-black'>
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet/>
        </main>
        <Footer/>
      </div>
    </div>
      
  ):null
}

export default App
