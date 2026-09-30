import React from "react";

// Lightweight inline SVG icon set (stroke icons, inherit currentColor)
const base = (path, { size = 20, className = "", strokeWidth = 1.8, fill = "none" } = {}) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={fill}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        aria-hidden="true"
    >
        {path}
    </svg>
);

export const HomeIcon = (p) => base(<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" /></>, p);
export const GridIcon = (p) => base(<><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>, p);
export const PlusIcon = (p) => base(<><path d="M12 5v14" /><path d="M5 12h14" /></>, p);
export const UserIcon = (p) => base(<><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>, p);
export const LogoutIcon = (p) => base(<><path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" /><path d="M10 17l-5-5 5-5" /><path d="M5 12h11" /></>, p);
export const LoginIcon = (p) => base(<><path d="M15 3h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-3" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /></>, p);
export const SparkIcon = (p) => base(<><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></>, p);
export const CommentIcon = (p) => base(<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />, p);
export const RepostIcon = (p) => base(<><path d="M17 2l4 4-4 4" /><path d="M3 11V9a3 3 0 0 1 3-3h15" /><path d="M7 22l-4-4 4-4" /><path d="M21 13v2a3 3 0 0 1-3 3H3" /></>, p);
export const HeartIcon = (p) => base(<path d="M12 20s-7-4.4-9.3-9A5 5 0 0 1 12 6a5 5 0 0 1 9.3 5C19 15.6 12 20 12 20Z" />, p);
export const EyeIcon = (p) => base(<><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" /><circle cx="12" cy="12" r="3" /></>, p);
export const ShareIcon = (p) => base(<><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7" /><path d="M16 6l-4-4-4 4" /><path d="M12 2v14" /></>, p);
export const BookmarkIcon = (p) => base(<path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" />, p);
export const MoreIcon = (p) => base(<><circle cx="5" cy="12" r="1.2" /><circle cx="12" cy="12" r="1.2" /><circle cx="19" cy="12" r="1.2" /></>, p);
export const ArrowLeftIcon = (p) => base(<><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></>, p);
export const CloseIcon = (p) => base(<><path d="M18 6 6 18" /><path d="M6 6l12 12" /></>, p);
export const ImageIcon = (p) => base(<><rect x="3" y="3" width="18" height="18" rx="3" /><circle cx="9" cy="9" r="2" /><path d="M21 15l-5-5L5 21" /></>, p);
export const SmileIcon = (p) => base(<><circle cx="12" cy="12" r="9" /><path d="M8 14s1.5 2 4 2 4-2 4-2" /><path d="M9 9h.01M15 9h.01" /></>, p);
export const PollIcon = (p) => base(<><path d="M6 20V10" /><path d="M12 20V4" /><path d="M18 20v-6" /></>, p);
export const ClockIcon = (p) => base(<><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>, p);
export const PinIcon = (p) => base(<><path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12Z" /><circle cx="12" cy="10" r="2.5" /></>, p);
export const FlagIcon = (p) => base(<><path d="M4 22V4" /><path d="M4 4h12l-2 4 2 4H4" /></>, p);
export const CameraIcon = (p) => base(<><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13.5" r="3.5" /></>, p);
export const CalendarIcon = (p) => base(<><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>, p);
export const MessageIcon = (p) => base(<><path d="M4 4h16v12H8l-4 4Z" /></>, p);
export const VerifiedIcon = ({ size = 16, className = "" } = {}) => (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true">
        <path fill="currentColor" d="M12 2l2.4 1.8 3-.2.9 2.9 2.5 1.7-1 2.8 1 2.8-2.5 1.7-.9 2.9-3-.2L12 22l-2.4-1.8-3 .2-.9-2.9-2.5-1.7 1-2.8-1-2.8 2.5-1.7.9-2.9 3 .2Z" />
        <path d="M8.5 12.2l2.3 2.3 4.7-4.7" fill="none" stroke="#07070b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
