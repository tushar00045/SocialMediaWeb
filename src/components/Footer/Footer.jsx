import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

// Slim, low-key footer. Hidden on mobile (the floating dock takes its place).
function Footer() {
  const authStatus = useSelector((state) => state.auth.status)

  return (
    <footer className="hidden md:block px-6 pb-6 pt-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-white/5 bg-white/2 px-6 py-4 text-sm text-zinc-500">
        <div className="flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-volt shadow-[0_0_10px_2px_rgba(212,255,58,0.6)]" />
          <span>Made with care · © {new Date().getFullYear()}</span>
        </div>

        <nav className="flex items-center gap-6">
          <Link to="/" className="hover:text-white transition">Home</Link>
          {authStatus && <Link to="/all-posts" className="hover:text-white transition">Explore</Link>}
          {authStatus && <Link to="/add-post" className="hover:text-white transition">Create</Link>}
          {!authStatus && <Link to="/login" className="hover:text-white transition">Login</Link>}
          {!authStatus && <Link to="/signup" className="hover:text-white transition">Sign up</Link>}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
