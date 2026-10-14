import React, { useEffect, useRef, useState } from "react";
import { MoreIcon } from "./Icons";

function OptionsMenu({
    options = [],
    className = "",
}) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    return (
        <div ref={menuRef} className={`relative ${className}`}>
            <button
                type="button"
                aria-label="More options"
                aria-expanded={open}
                onClick={(event) => {
                    event.stopPropagation();
                    setOpen((prev) => !prev);
                }}
                className="grid h-8 w-8 place-items-center rounded-lg text-zinc-500 transition hover:bg-white/5 hover:text-volt"
            >
                <MoreIcon size={18} />
            </button>

            {open && (
                <div className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-2xl border border-white/10 bg-[#151515] p-1.5 shadow-2xl">
                    {options.map((option) => (
                        <button
                            key={option.label}
                            type="button"
                            disabled={option.disabled}
                            onClick={() => {
                                setOpen(false);
                                option.onClick();
                            }}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-zinc-200 transition hover:bg-white/5 hover:text-volt disabled:cursor-not-allowed disabled:opacity-50 ${
                                option.className ?? ""
                            }`}
                        >
                            {option.icon && (
                                <span className="shrink-0">
                                    {option.icon}
                                </span>
                            )}
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default OptionsMenu;