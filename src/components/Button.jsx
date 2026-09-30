import React from 'react'

function Button({
  children,
  type = 'button',
  bgColor = 'bg-volt',
  textColor = 'text-black',
  className = '',
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold tracking-tight ${bgColor} ${textColor} shadow-[0_8px_30px_-12px_rgba(212,255,58,0.55)] hover:brightness-110 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button
