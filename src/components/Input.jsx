import React, {useId} from 'react'

const Input = React.forwardRef( function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref){
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label
            className='inline-block mb-2 pl-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400'
            htmlFor={id}>
                {label}
            </label>
            }
            <input
            type={type}
            className={`w-full px-4 py-3 rounded-xl bg-ink-800 text-zinc-100 placeholder-zinc-500 outline-none border border-white/[0.07] hover:border-white/15 focus:border-volt/70 focus:ring-4 focus:ring-volt/10 duration-200
                file:mr-4 file:rounded-lg file:border-0 file:bg-volt file:px-4 file:py-2 file:text-sm file:font-semibold file:text-black hover:file:brightness-110 file:cursor-pointer
                ${className}`}
            ref={ref}
            {...props}
            id={id}
            />
        </div>
    )
})

export default Input
