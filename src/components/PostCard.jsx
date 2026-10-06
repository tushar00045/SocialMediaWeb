import React,{useState,useEffect} from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import userImage from "../assets/wolf69w-nature-10184389.jpg";
import { useSelector } from "react-redux";
import {profileAppwrite} from "../appwrite/profileConfig";
import { CommentIcon, RepostIcon, HeartIcon, EyeIcon, ShareIcon, MoreIcon, VerifiedIcon } from "./Icons";
import timeAgo from "../utils/timeAgo";
function PostCard({
    $id,
    title,
    content,
    featuredImage,
    userid,
    userName,
    likes,
    createdAt,
    comments
})
{
    const profile = useSelector((state) => state.profile.profiles.find((prof) => prof.$id === userid));

    const profileImageUrl = profile?.profileImage ? profileAppwrite.getFileView(profile.profileImage) : userImage;

    const chip = "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-zinc-400 bg-white/[0.03] border border-white/[0.05] transition-all duration-200";

    return (
        <Link
            to={`/post/${$id}`}
            className="block group animate-rise"
        >
            <article className="surface relative mb-4 overflow-hidden rounded-3xl p-5 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-white/12 group-hover:shadow-[0_24px_60px_-30px_rgba(139,124,255,0.45)]">

                {/* ================= USER ================= */}

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Profile Image */}
                        <div className="ring-gradient rounded-2xl p-0.5">
                            <img
                                src={profileImageUrl}
                                alt={userName}
                                className="w-11 h-11 rounded-[14px] object-cover bg-ink-800"
                            />
                        </div>

                        {/* User Information */}
                        <div className="leading-tight">
                            <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-white">
                                    {userName}
                                </span>

                                <VerifiedIcon size={15} className="text-volt" />

                            </div>

                            <span className="text-zinc-500 text-sm">
                                @{userName
                                    ?.replace(/\s+/g, "_")
                                    .toLowerCase() || "user"}
                                <span className="mx-1.5">·</span>
                               {timeAgo(createdAt)}
                            </span>

                        </div>

                    </div>

                    <button
                        onClick={(e) => e.preventDefault()}
                        className="grid h-9 w-9 place-items-center rounded-xl text-zinc-500 hover:text-white hover:bg-white/6 transition"
                    >
                        <MoreIcon size={20} />
                    </button>

                </div>

                {/* ================= POST CONTENT ================= */}

                <div className="mb-4">
                    <h2 className="font-display text-xl font-bold tracking-tight text-white mb-2 group-hover:text-volt transition-colors">
                        {title}
                    </h2>
                    {content && (
                        <div
                            className="post-body clamp-4 text-zinc-300 leading-7"
                            dangerouslySetInnerHTML={{
                                __html: content
                            }}
                        />
                    )}

                </div>

                {/* ================= IMAGE ================= */}

                {featuredImage && (
                    <div className="w-full mb-4 overflow-hidden rounded-2xl border border-white/6 bg-black/40">
                        <img
                            src={appwriteService.getFileView(
                                featuredImage
                            )}
                            alt={title}
                            className="w-full max-h-150 object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                    </div>
                )}
                {/* ================= DATE / VIEWS ================= */}

                <div className="text-zinc-500 text-xs pb-3 flex items-center gap-2">
                    <span>{new Date(createdAt).toLocaleString("en-IN")}</span>
                    <span className="h-1 w-1 rounded-full bg-zinc-600" />
                    <span className="text-zinc-300 font-medium">
                        64.6K Views
                    </span>

                </div>

                {/* ================= ACTION BAR ================= */}
                <div className="flex flex-wrap items-center gap-2">
                        {/* Like */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className={`${chip} hover:text-coral hover:border-coral/30 hover:bg-coral/10`}
                        >
                            <HeartIcon size={17} />
                            <span>
                                {likes}
                            </span>
                        </button>
                        {/* Comment */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className={`${chip} hover:text-iris hover:border-iris/30 hover:bg-iris/10`}
                        >
                            <CommentIcon size={17} />
                            <span>
                                {comments}
                            </span>
                        </button>
                        {/* Repost */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className={`${chip} hover:text-volt hover:border-volt/30 hover:bg-volt/10`}
                        >
                            <RepostIcon size={17} />
                            <span>
                                180
                            </span>
                        </button>
                        {/* views */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className={`${chip} hidden sm:flex hover:text-white`}
                        >
                            <EyeIcon size={17} />
                            <span>
                                1.6K
                            </span>
                        </button>
                        {/* Share */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className="ml-auto grid h-9 w-9 place-items-center rounded-full text-zinc-400 bg-white/3 border border-white/5 hover:text-volt hover:bg-volt/10 transition"
                        >
                            <ShareIcon size={17} />
                        </button>
                </div>
            </article>
        </Link>
    );
}

export default PostCard;
