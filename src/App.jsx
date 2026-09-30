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
  <div className="min-h-screen flex flex-col bg-ink-950 text-zinc-100 font-sans">
      <Header />
      <main className="flex-1 pb-28 md:pb-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  ) : (
    <div className="min-h-screen grid place-items-center bg-ink-950">
      <div className="h-10 w-10 rounded-xl bg-linear-to-br from-volt to-iris animate-spin" />
    </div>
  )

}

export default App
