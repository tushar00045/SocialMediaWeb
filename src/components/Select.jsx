import React,{useId} from 'react'

function Select({
  options,
  label,
  className = "",
  ...props
}, ref) {
  const id = useId()
  return (
    <div className='w-full'>
      {label && <label htmlFor={id} className='inline-block mb-2 pl-1 text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400'>
        {label}
      </label>}
      <div className='relative'>
        <select
          {...props}
          id={id}
          ref={ref}
          className={`w-full appearance-none px-4 py-3 pr-10 rounded-xl bg-ink-800 text-zinc-100 outline-none border border-white/[0.07] hover:border-white/15 focus:border-volt/70 focus:ring-4 focus:ring-volt/10 duration-200 capitalize cursor-pointer ${className}`}
        >
          {options?.map((option) => (
            <option key={option} value={option} className='bg-ink-800'>
              {option}
            </option>
          ))}
        </select>
        <span className='pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500'>▾</span>
      </div>
    </div>
  )
}

export default React.forwardRef(Select)
