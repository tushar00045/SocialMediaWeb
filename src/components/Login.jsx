// ⚠️ You didn't upload your Login component, so this follows the same pattern as your Signup.
// If your existing Login has different logic, keep YOUR `login` function below
// and only copy the JSX (the return block).
import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {login as authLogin} from '../store/authSlice'
import {Button, Input, Logo} from './index.js'
import {useDispatch} from 'react-redux'
import authService from '../appwrite/auth'
import {useForm} from 'react-hook-form'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")

    const login = async(data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if(userData) dispatch(authLogin(userData));
                navigate("/")
            }
        } catch (error) {
            setError(error.message)
        }
    }

  return (
    <div className="flex items-center justify-center px-4 py-6">
        <div className="mx-auto grid w-full max-w-4xl overflow-hidden rounded-3xl surface md:grid-cols-2 shadow-[0_40px_120px_-40px_rgba(139,124,255,0.5)] animate-rise">

            {/* ===== Form panel ===== */}
            <div className="p-7 sm:p-10 order-2 md:order-1">
                <div className="mb-6 flex justify-center md:hidden">
                    <span className="inline-block w-full max-w-25 text-white">
                        <Logo width="100%" />
                    </span>
                </div>
                <h2 className="font-display text-3xl font-bold leading-tight tracking-tight text-white">Welcome back</h2>
                <p className="mt-2 text-base text-zinc-400">
                    Don&apos;t have an account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-semibold text-volt transition-all duration-200 hover:underline underline-offset-4"
                    >
                        Sign Up
                    </Link>
                </p>
                {error && <p className="mt-6 rounded-xl border border-coral/30 bg-coral/10 px-4 py-3 text-sm text-coral">{error}</p>}

                <form onSubmit={handleSubmit(login)} className="mt-8">
                    <div className='space-y-5'>
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
                            required: true,
                        })}
                        />
                        <Button type="submit" className="w-full py-3.5 mt-2">
                            Sign in
                        </Button>
                    </div>
                </form>
            </div>

            {/* ===== Brand panel ===== */}
            <div className="relative hidden md:flex order-1 md:order-2 flex-col justify-between p-10 bg-linear-to-bl from-volt/15 via-ink-800 to-iris/30">
                <div className="absolute -top-16 -right-16 h-64 w-64 rounded-full bg-volt/20 blur-3xl" />
                <div className="absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-iris/30 blur-3xl" />
                <span className="relative inline-block w-full max-w-25 text-white font-display font-bold">
                    <Logo width="100%" />
                </span>
                <div className="relative">
                    <h3 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-white">
                        Good to see <span className="text-gradient">you again.</span>
                    </h3>
                    <p className="mt-4 text-zinc-300/80 leading-7">
                        Your people, your conversations — right where you left them.
                    </p>
                </div>
                <div className="relative text-sm text-zinc-500">Sign in to continue</div>
            </div>
        </div>
    </div>
  )
}

export default Login
