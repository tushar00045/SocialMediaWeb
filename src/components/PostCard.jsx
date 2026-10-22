import React,{useState,useEffect,useRef} from "react";
import appwriteService from "../appwrite/config";
import DOMPurify from "dompurify";
import { Link } from "react-router-dom";
import userImage from "../assets/wolf69w-nature-10184389.jpg";
import { useSelector } from "react-redux";
import {profileAppwrite} from "../appwrite/profileConfig";
import { CommentIcon, RepostIcon, HeartIcon, EyeIcon, ShareIcon, MoreIcon, VerifiedIcon } from "./Icons";
import timeAgo from "../utils/timeAgo";
import { appwritelike } from "../appwrite/likeConfig";
import CommentBox from "./CommentBox";
import appwriteRepost from "../appwrite/repostConfig";
import useOptimisticAction from "../hooks/useOptimisticAction";
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
    viewCount,
    repostCount,
    onUnrepost,
}) {
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(likes ?? 0);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [commentCount, setCommentCount] = useState(comments ?? 0);
    const [reposted, setReposted] = useState(false);
    const [reposts, setReposts] = useState([]);
    const [repostC, setRepostCount] = useState(repostCount ?? 0);
    const postRef = useRef(null);
    const hasCountRef = useRef(false);
    const {runAction: runLikeAction,pending:likePending} = useOptimisticAction();
    const {runAction: runRepostAction,pending: repostPending,} = useOptimisticAction();
    const [likeStateLoaded, setLikeStateLoaded] = useState(false);
    const [repostStateLoaded, setRepostStateLoaded] = useState(false);

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
        let cancelled = false;

        setLikeStateLoaded(false);

        if (!$id || !userData?.$id) {
            setLiked(false);
            setLikeStateLoaded(true);
            return;
        }

        appwritelike.getLikeUsers($id)
            .then((res) => {
                if (cancelled) return;

                setLiked(
                    res?.documents?.some(
                        (like) => like.userId === userData.$id
                    ) ?? false
                );
            })
            .catch((error) => {
                console.error("Failed to load like state:", error);
            })
            .finally(() => {
                if (!cancelled) setLikeStateLoaded(true);
            });

        return () => {
            cancelled = true;
        };
    }, [$id, userData?.$id]);

    useEffect(() => {
        let cancelled = false;

        setRepostStateLoaded(false);

        if (!userData?.$id || !$id) {
            setReposted(false);
            setRepostStateLoaded(true);
            return;
        }

        const loadRepostState = async () => {
            try {
                const result = await appwriteRepost.getRepostsUsers(
                    userData.$id
                );

                if (cancelled) return;

                if (!result) {
                    throw new Error("Failed to load repost state");
                }

                const alreadyReposted = result.documents.some(
                    (item) =>
                        item.userId === userData.$id &&
                        item.postId === $id
                );

                setReposted(alreadyReposted);
            } catch (error) {
                console.error("Error fetching repost state:", error);
            } finally {
                if (!cancelled) {
                    setRepostStateLoaded(true);
                }
            }
        };

        loadRepostState();

        return () => {
            cancelled = true;
        };
    }, [$id, userData?.$id]);
    /*
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
    */
    
    const handleLikes = async (postId) => {
        if (!userData?.$id || !likeStateLoaded || likePending) return;

        const wasLiked = liked;
        const previousCount = likesCount;
        const shouldLike = !wasLiked;

        await runLikeAction({
            optimisticUpdate: () => {
                setLiked(shouldLike);
                setLikesCount(
                    Math.max(
                        0,
                        previousCount + (shouldLike ? 1 : -1)
                    )
                );
            },

            action: async () => {
                // Keep your existing Appwrite create/delete operations.
                if (shouldLike) {
                    const result = await appwritelike.createLike({
                        postId,
                        userId: userData.$id,
                    });

                    if (!result) {
                        throw new Error("Could not create like");
                    }

                    return result;
                }

                const result = await appwritelike.deleteLike({
                    postId,
                    userId: userData.$id,
                });

                if (!result) {
                    throw new Error("Could not delete like");
                }

                return result;
            },

            rollback: () => {
                setLiked(wasLiked);
                setLikesCount(previousCount);
            },

            onError: (error) => {
                console.error("Like action failed:", error);
            },
        });
    };

/*
    const handleRepost = async () => {
        console.log("handleRepost function is calling.");
        const result = await appwriteRepost.getRepostsUsers(userData?.$id);
        if (!result) {
            return;
        }

        const alreadyRepost = result.documents.find((repost) => repost.userId === userData?.$id && repost.postId === $id);

        if (alreadyRepost) {
            const deleteRepost = await appwriteRepost.deleteRepost({ userId: userData?.$id, postId: $id });

            if (!deleteRepost) {
                return;
            }

            setReposted(false);
            // Remove this card from the Reposts page
            onUnrepost?.();

            setReposts((prev) => prev.filter((repost) => repost.$id !== alreadyRepost.$id));

            const updatePost = await appwriteService.decrementPostRepost($id);

            if (updatePost) {
                setRepostCount(updatePost.repostCount);
            }
        }
        else {
            const createRepost = await appwriteRepost.createRepost({
                userId: userData?.$id,
                postId: $id,
                posterId: userid
            });

            if (!createRepost) {
                return;
            }

            setReposted(true);
            setReposts((prev)=>[...prev,createRepost]);

            const updatePost = await appwriteService.incrementPostRepost($id);
            if (updatePost) {
                setRepostCount(updatePost.repostCount);
            }
        }
    }
    */
    
    
    const handleRepost = async () => {
        if (!userData?.$id || !repostStateLoaded || repostPending) {
            return;
        }

        const wasReposted = reposted;
        const previousCount = repostC;
        const shouldRepost = !wasReposted;

        await runRepostAction({
            optimisticUpdate: () => {
                setReposted(shouldRepost);
                setRepostCount(
                    Math.max(
                        0,
                        previousCount + (shouldRepost ? 1 : -1)
                    )
                );
            },

            action: async () => {
                if (shouldRepost) {
                    const created = await appwriteRepost.createRepost({
                        userId: userData.$id,
                        postId: $id,
                        posterId: userid,
                    });

                    if (!created) {
                        throw new Error("Failed to create repost");
                    }

                    const updatedPost =
                        await appwriteService.incrementPostRepost($id);

                    if (!updatedPost) {
                        // The repost record exists, but the count update failed.
                        // Attempt to undo the record creation.
                        await appwriteRepost.deleteRepost({
                            userId: userData.$id,
                            postId: $id,
                        });

                        throw new Error("Failed to update repost count");
                    }

                    setReposts((prev) => [...prev, created]);
                    return created;
                }

                const deleted = await appwriteRepost.deleteRepost({
                    userId: userData.$id,
                    postId: $id,
                });

                if (!deleted) {
                    throw new Error("Failed to delete repost");
                }

                const updatedPost =
                    await appwriteService.decrementPostRepost($id);

                if (!updatedPost) {
                    // Best-effort restoration if the count update fails.
                    await appwriteRepost.createRepost({
                        userId: userData.$id,
                        postId: $id,
                        posterId: userid,
                    });

                    throw new Error("Failed to update repost count");
                }

                setReposts((prev) =>
                    prev.filter(
                        (item) =>
                            !(
                                item.userId === userData.$id &&
                                item.postId === $id
                            )
                    )
                );

                return deleted;
            },

            rollback: () => {
                setReposted(wasReposted);
                setRepostCount(previousCount);
            },

            onSuccess: () => {
                if (!shouldRepost) {
                    onUnrepost?.();
                }
            },

            onError: (error) => {
                console.error("Repost action failed:", error);
            },
        });
    };


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
                                __html: DOMPurify.sanitize(content)
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
                            disabled={likePending}
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
                            onClick={(e) =>{ e.preventDefault();
                                handleRepost()
                            console.log("function streeming.")}
                            }
                            disabled={!repostStateLoaded || repostPending}
                            className={`${chip} hover:text-volt hover:border-volt/30 hover:bg-volt/10`}
                        >
                            <RepostIcon size={17}
                            className={reposted?"text-volt":""}
                            />
                            <span>
                                {repostC}
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
