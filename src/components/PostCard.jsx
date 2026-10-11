import React,{useState,useEffect,useRef} from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import userImage from "../assets/wolf69w-nature-10184389.jpg";
import { useSelector } from "react-redux";
import {profileAppwrite} from "../appwrite/profileConfig";
import { CommentIcon, RepostIcon, HeartIcon, EyeIcon, ShareIcon, MoreIcon, VerifiedIcon } from "./Icons";
import timeAgo from "../utils/timeAgo";
import { appwritelike } from "../appwrite/likeConfig";
import CommentBox from "./CommentBox";
function PostCard({
    $id,
    title,
    content,
    featuredImage,
    userid,
    userName,
    likes,
    createdAt,
    comments,
    viewCount
}) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(likes ?? 0);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [commentCount, setCommentCount] = useState(comments ??0);
    const postRef = useRef(null);
    const hasCountRef = useRef(false);

    const profile = useSelector((state) => state.profile.profiles.find((prof) => prof.$id === userid));

    const profileImageUrl = profile?.profileImage ? profileAppwrite.getFileView(profile.profileImage) : userImage;

    const userData = useSelector((state) => state.auth.userData);

    const chip = "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-zinc-400 bg-white/[0.03] border border-white/[0.05] transition-all duration-200";

    useEffect(() => {
        const element = postRef.current;

        if (!element || !$id) return;

        let timer = null;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasCountRef.current) {
                    //statrt timer when at least 50% is visible

                    if (timer === null) {
                        timer = setTimeout(async () => {
                            hasCountRef.current = true;

                            try {
                                await appwriteService.incrementPostViews($id);
                                console.log("View countted for post:", $id);
                            } catch (error) {
                                hasCountRef.current = false;
                                console.log("Failed to count view:", error);
                            }
                        }, 2000);
                    }
                }
                else {
                    clearTimeout(timer);
                    timer = null;
                }    
            },
            {threshold:0.5}
        );
        observer.observe(element);

        return () => {
            clearTimeout(timer);
            observer.disconnect();
        };
    }, [$id])

    useEffect(() => {
        if (!$id || !userData) return;
        appwritelike.getLikeUsers($id).then((res) =>
            setLiked(res?.documents?.some((l) => l.userId === userData.$id))
        );
    }, [$id, userData]);
    
    const handleLikes = async ($id) => {
        const result = await appwritelike.getLikeUsers($id);

        if (!result) {
            return;
        }

        const alreadyLiked = result.documents.some((like) =>
            like.userId === userData?.$id
        );

        if (alreadyLiked) {
            const deleteLike = await appwritelike.deleteLike({
                postId: $id, userId: userData?.$id
            });

            if (!deleteLike) {
                return;
            }

            setLiked(false);

            const updatePost = await appwriteService.decrementPostLikes($id);

            if (updatePost) {
                setLikesCount(updatePost.likes);
            }
        }
        else {
            const createLike = await appwritelike.createLike({
                postId: $id, userId: userData?.$id
            });

            if (!createLike) {
                return;
            }

            setLiked(true);

            const updatePost = await appwriteService.incrementPostLikes($id);

            if (updatePost) {
                setLikesCount(updatePost.likes);
            }
        }
    }

    const handleShare = async () => {
        console.log("share button is working.")
        const shareUrl = window.location.href;

        try {
            if (navigator.share) {
            await navigator.share({
                title: post?.title,
                text: "Check out this post!",
                url: shareUrl,
            });
            } else {
            await navigator.clipboard.writeText(shareUrl);
            alert("Link copied!");
            }
        } catch (error) {
            console.log("Share cancelled or failed:", error);
        }
    };
    const actionBtn = "flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-medium text-zinc-400 bg-white/[0.03] border border-white/[0.06] transition-all duration-200";

    return (
       <div ref={postRef}>
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
                        {viewCount}
                    </span>

                </div>

                {/* ================= ACTION BAR ================= */}
                <div className="flex flex-wrap items-center gap-2">
                        {/* Like */}
                        <button
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                handleLikes($id)
                            }}
                            className={`${actionBtn} hover:text-coral hover:border-coral/40 hover:bg-coral/10 ${liked ? "text-coral border-coral/40 bg-coral/10" : ""}`}
                        >
                                    <HeartIcon size={19} fill={liked ? "currentColor" : "none"}
                            className={liked? "text-coral" : ""}        />
                            <span>
                                {likesCount}
                            </span>
                        </button>
                        {/* Comment */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setShowCommentBox(true)
                            }}
                            className={`${chip} hover:text-iris hover:border-iris/30 hover:bg-iris/10`}
                        >
                            <CommentIcon size={17} />
                            <span>
                                {commentCount}
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
                                {viewCount}
                            </span>
                        </button>
                        {/* Share */}
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                handleShare
                            }}
                            className="ml-auto grid h-9 w-9 place-items-center rounded-full text-zinc-400 bg-white/3 border border-white/5 hover:text-volt hover:bg-volt/10 transition"
                        >
                            <ShareIcon size={17} />
                        </button>
                </div>
            </article>
            </Link>
            {showCommentBox && (<CommentBox post={{
                $id,
                title,
                content,
                featuredImage,
                userid,
                userName,
                likes,
                createdAt,
                comments,
                viewCount    
            }} onclose={() => setShowCommentBox(false)}     onCommentAdded={(newComment) => {
            setCommentCount((prev) => prev + 1);
            }} />)}
      </div>
    );
}

export default PostCard;
