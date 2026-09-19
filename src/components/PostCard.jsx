import React,{useState,useEffect} from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import userImage from "../assets/wolf69w-nature-10184389.jpg";
import { useSelector } from "react-redux";
import profileAppwrite from "../appwrite/profileConfig";
import commentImg from "../assets/chatImg.png"
import tweetImg from "../assets/retweet.png"
import likeImg from "../assets/like.png"
import viewsImg from "../assets/visual.png"
import shareImg from "../assets/next.png";

function PostCard({
    $id,
    title,
    content,
    featuredImage,
    userid,
    userName
})
{  
    const profile = useSelector((state) => state.profile.profiles.find((prof) => prof.$id === userid));


    const profileImageUrl = profile?.profileImage ? profileAppwrite.getFileView(profile.profileImage) : userImage;

    return (
        <Link
            to={`/post/${$id}`}
            className="block"
        >
            <article className="bg-black text-white border-b border-gray-800 px-5 py-5 hover:bg-gray-950 transition">

                {/* ================= USER ================= */}

                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {/* Profile Image */}
                        <img
                            src={profileImageUrl}
                            alt={userName}
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        {/* User Information */}
                        <div>
                            <div className="flex items-center gap-1">
                                <span className="font-bold">
                                    {userName}
                                </span>

                                <span className="text-blue-500">
                                    ●
                                </span>

                            </div>

                            <span className="text-gray-500 text-sm">
                                @{userName
                                    ?.replace(/\s+/g, "_")
                                    .toLowerCase() || "user"}
                            </span>

                        </div>

                    </div>

                    <button
                        onClick={(e) => e.preventDefault()}
                        className="text-gray-500 text-xl hover:text-white"
                    >
                        ⋯
                    </button>

                </div>

                {/* ================= POST CONTENT ================= */}

                <div className="mb-4">
                    <h2 className="text-xl font-bold mb-3">
                        {title}
                    </h2>
                    {content && (
                        <div
                            className="text-gray-300 leading-7"
                            dangerouslySetInnerHTML={{
                                __html: content
                            }}
                        />
                    )}

                </div>

                {/* ================= IMAGE ================= */}

                {featuredImage && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFileView(
                                featuredImage
                            )}
                            alt={title}
                            className="w-full max-h-150 object-contain rounded-2xl border border-gray-800"
                        />
                    </div>
                )}
                {/* ================= DATE / VIEWS ================= */}

                <div className="text-gray-500 text-sm py-3">
                    8:34 PM · Aug 12, 2026 ·{" "}
                    <span className="text-gray-300 font-semibold">
                        64.6K Views
                    </span>

                </div>

                {/* ================= ACTION BAR ================= */}
                <div className="border-t border-gray-800 pt-4">
                    <div className="flex items-center justify-between text-gray-500">
                        {/* Comment */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className="flex items-center gap-2 hover:text-blue-400"
                        >
                            <span className="text-xl">
                                <img src={commentImg}
                                                    className="size-8"
                                                                    />
                            </span>

                            <span>
                                13
                            </span>

                        </button>
                        {/* Repost */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className="flex items-center gap-2 hover:text-green-400"
                        >
                            <span className="text-xl">
                                <img src={tweetImg} className="size-8" />
                            </span>

                            <span>
                                180
                            </span>

                        </button>
                        {/* Like */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className="flex items-center gap-2 hover:text-pink-500"
                        >

                            <span className="text-xl">
                                 <img src={likeImg} className="size-8" />
                            </span>

                            <span>
                                696
                            </span>

                        </button>
                        {/* views */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className="flex items-center gap-2 hover:text-yellow-400"
                        >
                            <span className="text-xl">
                               <img src={viewsImg} className="size-8" />
                            </span>

                            <span>
                                1.6K
                            </span>

                        </button>
                        {/* Share */}
                        <button
                            onClick={(e) => e.preventDefault()}
                            className="text-xl hover:text-blue-400"
                        >
                            <img src={shareImg} className="size-8" />
                        </button>
                    </div>
                </div>
            </article>
        </Link>
    );
}

export default PostCard;