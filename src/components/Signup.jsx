import React, {useState} from 'react'
import authService from '../appwrite/auth'
import {Link ,useNavigate} from 'react-router-dom'
import {login} from '../store/authSlice'
import {Button, Input, Logo} from './index.js'
import {useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import {profileAppwrite} from '../appwrite/profileConfig'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()

    const create = async(data) => {
        setError("")
        try {
            const userData = await authService.createAccount(data)
            if (userData) {
                const user = await authService.getCurrentUser()
                await profileAppwrite.createProfile({
                        userId: user.$id,
                        bio: "",
                        address: "",
                        profileImage: "",
                        coverImage: "",
                        profileName:user?.name
                    });
                if(user) dispatch(login(user));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className="flex items-center justify-center px-4 py-6">
        <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-3xl surface md:grid-cols-2 shadow-[0_40px_120px_-40px_rgba(139,124,255,0.5)] animate-rise">

            {/* ===== Brand panel ===== */}
            <div className="relative hidden md:flex flex-col justify-between p-10 bg-linear-to-br from-iris/30 via-ink-800 to-volt/10">
                <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-iris/30 blur-3xl" />
                <div className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-volt/20 blur-3xl" />
                <span className="relative inline-block w-full max-w-25 text-white font-display font-bold">
                    <Logo width="100%" />
                </span>
                <div className="relative">
                    <h3 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white">
                        Say it <span className="text-gradient">your way.</span>
                    </h3>
                    <p className="mt-4 text-zinc-300/80 leading-7">
                        Share ideas, follow people who inspire you, and join conversations that matter.
                    </p>
                </div>
                <div className="relative flex -space-x-2">
                    {["bg-volt", "bg-iris", "bg-coral", "bg-white"].map((c) => (
                        <span key={c} className={`h-9 w-9 rounded-xl border-2 border-ink-800 ${c}`} />
                    ))}
                    <span className="pl-4 self-center text-sm text-zinc-400">Join the community</span>
                </div>
            </div>

            {/* ===== Form panel ===== */}
            <div className="p-7 sm:p-10">
                <div className="mb-6 flex justify-center md:hidden">
                    <span className="inline-block w-full max-w-25 text-white">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-white">Create account</h2>
                <p className="mt-2 text-base text-zinc-400">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-semibold text-volt transition-all duration-200 hover:underline underline-offset-4"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="mt-6 rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>}

                <form onSubmit={handleSubmit(create)} className="mt-8">
                    <div className='space-y-5'>
                        <Input
                        label="Full Name"
                        placeholder="Enter your full name"
                        {...register("name", {
                            required: true,
                        })}
                        />
                        <Input
                        label="Email"
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPatern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                            }
                        })}
                        />
                        <Input
                        label="Password"
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", {
                            required: true,})}
                        />
                        <Button type="submit" className="w-full py-3.5 mt-2">
                            Create Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    </div>
  )
}

export default Signup
