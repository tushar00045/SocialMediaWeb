import React from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Logo } from '../index'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import {profileAppwrite} from '../../appwrite/profileConfig'
import defaultProfileImage from '../../assets/wolf69w-nature-10184389.jpg'
import { HomeIcon, GridIcon, PlusIcon, UserIcon, LogoutIcon, LoginIcon, SparkIcon } from '../Icons'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const profiles = useSelector((state) => state.profile.profiles)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const myProfile = profiles?.find((p) => p?.$id === userData?.$id)
  const avatar = myProfile?.profileImage ? profileAppwrite.getFileView(myProfile.profileImage) : defaultProfileImage

  const navItems = [
    {
      name: 'Home',
      slug: '/',
      icon: HomeIcon,
      active: true
    },
    {
      name: 'Explore',
      slug: '/all-posts', icon: GridIcon, active: authStatus
    },
    {
      name: 'Create',
      slug: '/add-post',
      icon: PlusIcon, active: authStatus
    },
    {
      name: 'Profile',
      slug: `/profile/${userData?.$id}`,
      icon: UserIcon,
      active: authStatus
    },
    {
      name: 'Login',
      slug: '/login',
      icon: LoginIcon,
      active: !authStatus
    },
    {
      name: 'Sign up',
      slug: '/signup',
      icon: SparkIcon,
      active: !authStatus
    },
  ]

  const logoutHandler = () => {
    authService.logout().then(() => {
      dispatch(logout())
    })
  }

  const pill = ({ isActive }) =>
    `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-white/[0.08] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
        : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
    }`

  return (
    <>
      {/* ================= DESKTOP / TOP BAR ================= */}
      <header className="sticky top-0 z-40 px-3 pt-3 md:px-6 md:pt-4">
        <nav className="glass mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-3 py-2.5 md:px-4 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)]">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2.5 pl-1">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-linear-to-br from-volt to-iris text-black shadow-[0_0_24px_-4px_rgba(212,255,58,0.6)]">
              <SparkIcon size={18} strokeWidth={2.4} />
            </span>
            <span className="hidden sm:block font-display text-lg font-bold tracking-tight text-white">
              <Logo width="90px" />
            </span>
          </Link>

          {/* Center nav (desktop) */}
          <ul className="hidden md:flex items-center gap-1 rounded-2xl bg-black/30 p-1">
            {navItems.filter((i) => i.active && i.name !== 'Create').map((item) => {
              const Icon = item.icon
              return (
                <li key={item.name}>
                  <NavLink to={item.slug} end={item.slug === '/'} className={pill}>
                    <Icon size={17} />
                    {item.name}
                  </NavLink>
                </li>
              )
            })}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {authStatus ? (
              <>
                <button
                  onClick={() => navigate('/add-post')}
                  className="hidden sm:inline-flex items-center gap-2 rounded-xl bg-volt px-4 py-2 text-sm font-semibold text-black hover:brightness-110 active:scale-95 transition"
                >
                  <PlusIcon size={16} strokeWidth={2.4} />
                  New post
                </button>

                <Link to={`/profile/${userData?.$id}`} className="ring-gradient rounded-xl p-0.5" title={userData?.name}>
                  <img src={avatar} alt="Me" className="h-9 w-9 rounded-[10px] object-cover bg-ink-800" />
                </Link>

                <button
                  onClick={logoutHandler}
                  title="Logout"
                  className="grid h-10 w-10 place-items-center rounded-xl text-zinc-400 hover:text-coral hover:bg-coral/10 transition"
                >
                  <LogoutIcon size={19} />
                </button>
              </>
            ) : (
              <div className="flex md:hidden items-center gap-2">
                <NavLink to="/login" className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white">Login</NavLink>
                <NavLink to="/signup" className="rounded-xl bg-volt px-4 py-2 text-sm font-semibold text-black">Join</NavLink>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* ================= MOBILE FLOATING DOCK ================= */}
      {authStatus && (
        <nav className="md:hidden fixed bottom-4 left-1/2 z-40 -translate-x-1/2">
          <ul className="glass flex items-center gap-1 rounded-2xl p-1.5 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.9)]">
            {navItems.filter((i) => i.active).map((item) => {
              const Icon = item.icon
              const isCreate = item.name === 'Create'
              return (
                <li key={item.name}>
                  <NavLink
                    to={item.slug}
                    end={item.slug === '/'}
                    className={({ isActive }) =>
                      isCreate
                        ? 'mx-1 grid h-12 w-12 place-items-center rounded-xl bg-volt text-black shadow-[0_0_24px_-6px_rgba(212,255,58,0.8)]'
                        : `grid h-12 w-12 place-items-center rounded-xl transition ${isActive ? 'bg-white/10 text-volt' : 'text-zinc-400'}`
                    }
                  >
                    <Icon size={isCreate ? 22 : 21} strokeWidth={isCreate ? 2.4 : 1.8} />
                  </NavLink>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </>
  )
}

export default Header
