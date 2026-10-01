import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import userImage from "../assets/wolf69w-nature-10184389.jpg"
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import profileAppwrite from "../appwrite/profileConfig";
import CommentBox from "../components/CommentBox";
import ShowComment from "../components/ShowComment";
import { setCurrentPost } from "../store/postSlice";
import { appwritelike, AppwriteLike } from "../appwrite/likeConfig";
import { ArrowLeftIcon, CommentIcon, RepostIcon, HeartIcon, EyeIcon, ShareIcon, MoreIcon, VerifiedIcon, BookmarkIcon } from "../components/Icons";
import { appwriteComment } from "../appwrite/commentConfig";
//import { setComments } from "../store/commentSlice";

export default function Post() {
    const [post, setPost] = useState(null);
    // const [profile, setProfile] = useState();
    const [likesCount, setLikesCount] = useState(0);
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [liked, setLiked] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentCount, setCommentCount] = useState(0);
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userid === userData.$id : false;


    const posts = useSelector((state) => state.post.posts);

    const getPost = async () => {
        const result = await appwriteService.getPost(slug);

        if (!result) return;

        setPost(result);
        setLikesCount(result.likes || 0);
    };

    useEffect(() => {
        getPost();
    }, [slug]);

    useEffect(() => {
        if (!slug) return;

        const foundPost = posts.find((post) => post.$id === slug);

        if (foundPost) {
            setPost(foundPost)

            dispatch(setCurrentPost(foundPost));
            return;
        }

        appwriteService.getPost(slug).then((postData) => {
            if (postData) {
                setPost(postData)
                console.log(postData.likes);
                //setLikesCount(postData.likes);
                dispatch(setCurrentPost(postData))
            }
            else navigate("/");
        });

    }, [posts, slug, navigate, dispatch])

    useEffect(() => {
        if (!slug || !userData) return;
        appwritelike.getLikeUsers(slug).then((res) =>
            setLiked(res?.documents?.some((l) => l.userId === userData.$id))
        );
    }, [slug, userData]);

    const CountComments = async () => {
        console.log("commentCount function is working.");
        const result = await appwriteComment.getComments(slug);
        console.log(result);
        setComments(result.documents);

        const length = result.documents.length;
        setCommentCount(length);
    }

    useEffect(() => {
        CountComments(slug);
    }, [slug])

    
    // const comments = useSelector((state) => state.comment.comments);
    // useEffect(() => {
    // if (!slug) return;
    //     const fetchComment = async () => {
    //     try {
    //         const result = await appwriteComment.getComments(slug);
    //         console.log("Comments", result.documents);
    //         const length=result.documents.length;
    //         setCommentCount(length);
    //         dispatch(setComments(result.documents));
    //     } catch (error) {
    //         console.error("Failed to Fetch the comment", error);
    //     }
    // }

    // fetchComment();
    // }, [slug])
    

    
    const userId = post?.userid;

    const profile = useSelector((state) => state.profile.profiles.find((prof) => prof.$id === userId));

    const userName = post?.userName;

    const deletePost = () => {
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        });
    };

    if (!post) {
        return null;
    }

    const profileImageUrl = profile?.profileImage ? profileAppwrite.getFileView(profile.profileImage) : userImage;
    console.log(profileImageUrl);

    const handleLikes = async (slug) => {
        const result = await appwritelike.getLikeUsers(slug);
        if (!result) {
            return;
        }

        const alreadyLiked = result.documents.some((like) => like.userId === userData?.$id);

        if (alreadyLiked) {
            // delete the Entry from the Like collection
            const deleteLike = await appwritelike.deleteLike({ postId:slug, userId: userData?.$id });

            if (!deleteLike) {
                return;
            }
            
            setLiked(false);

            const updatePost = await appwriteService.decrementPostLikes(slug);

            if (updatePost) {
                setLikesCount(updatePost.likes);
            }

        }
        else {
            //Add the Entry in the like collection
            const createLike = await appwritelike.createLike({ postId:slug, userId: userData?.$id });

            if (!createLike) {
                return;
            }
            
            setLiked(true);

            const updatePost = await appwriteService.incrementPostLikes(slug);

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
        <div className="min-h-screen py-6 text-zinc-100">
            <Container>
              <div className="mx-auto max-w-2xl animate-rise">

                {/* Back */}
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-zinc-400 hover:text-white hover:bg-white/5 transition"
                >
                    <ArrowLeftIcon size={18} /> Back
                </button>

                <article className="surface overflow-hidden rounded-3xl">
                {/* ================= USER INFORMATION ================= */}
                <div className="px-5 pt-5 pb-4 sm:px-6">
                    <div className="flex items-center justify-between">
                        {/* User */}
                        <div className="flex items-center gap-3">

                            <div className="ring-gradient rounded-2xl p-0.5">
                                <img
                                    src={profileImageUrl}
                                    alt="User"
                                    className="w-12 h-12 rounded-[14px] object-cover bg-ink-800"
                                />
                            </div>

                            <div className="leading-tight">
                                <div className="flex items-center gap-1.5">
                                   <Link
                                        to={`/profile/${post.userid}`}
                                        onClick={()=>console.log("Profile Link clicked.")}
                                        className="font-semibold text-white hover:text-volt transition-colors"
                                    >
                                        {userName}
                                    </Link>

                                    {/* Verified badge */}
                                    <VerifiedIcon size={16} className="text-volt" />
                                </div>

                                <span className="text-sm text-zinc-500">
                                    @{userName.replace(/\s+/g, "_").toLowerCase()}
                                </span>
                            </div>

                        </div>


                        {/* Right side */}
                        <div className="flex items-center gap-1 text-zinc-500">

                            <button className="grid h-9 w-9 place-items-center rounded-xl hover:text-white hover:bg-white/6 transition">
                                <BookmarkIcon size={18} />
                            </button>

                            <button className="grid h-9 w-9 place-items-center rounded-xl hover:text-white hover:bg-white/6 transition">
                                <MoreIcon size={20} />
                            </button>

                        </div>

                    </div>
                </div>


                {/* ================= POST CONTENT ================= */}
                <div className="px-5 sm:px-6">

                    <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
                        {post.title}
                    </h1>

                    <div className="post-body text-[17px] leading-8 mb-5 text-zinc-200">
                        {parse(post.content)}
                    </div>


                    {/* ================= FEATURED IMAGE ================= */}
                    <div className="w-full mb-4 overflow-hidden rounded-2xl border border-white/6 bg-black/40">
                        <img
                            src={appwriteService.getFileView(
                                post.featuredImage
                            )}
                            alt={post.title}
                            className="w-full max-h-162.5 object-contain"
                        />
                    </div>


                    {/* ================= DATE / VIEWS ================= */}
                    <div className="flex items-center gap-2 text-zinc-500 text-sm py-3">
                        <span>{new Date(post.$createdAt).toLocaleString("en-IN")}</span>
                        <span className="h-1 w-1 rounded-full bg-zinc-600" />
                        <span className="text-zinc-200 font-semibold">
                            64.6K Views
                        </span>
                    </div>


                    {/* ================= ACTION BAR ================= */}
                    <div className="border-t border-white/6 py-4">

                        <div className="flex flex-wrap items-center gap-2">

                            {/* Like */}
                            <button
                                onClick={()=>handleLikes(slug)}
                                className={`${actionBtn} hover:text-coral hover:border-coral/40 hover:bg-coral/10 ${liked ? "text-coral border-coral/40 bg-coral/10" : ""}`}
                            >
                                <HeartIcon size={19} fill={liked ? "currentColor" : "none"} />
                                <span>
                                    {likesCount}
                                </span>
                            </button>


                            {/* Comment */}
                            <button onClick={()=>setShowCommentBox(true)} className={`${actionBtn} hover:text-iris hover:border-iris/40 hover:bg-iris/10`}>
                                <CommentIcon size={19} />
                                <span>
                                    {commentCount}
                                </span>
                            </button>


                            {/* Repost */}
                            <button className={`${actionBtn} hover:text-volt hover:border-volt/40 hover:bg-volt/10`}>
                                <RepostIcon size={19} />
                                <span>
                                    180
                                </span>
                            </button>


                            {/* views*/}
                            <button className={`${actionBtn} hover:text-white`}>
                                <EyeIcon size={19} />
                                <span>
                                    1.6K
                                </span>
                            </button>


                            {/* Share */}
                            <button onClick={handleShare} className={`${actionBtn} ml-auto hover:text-volt hover:border-volt/40 hover:bg-volt/10`}>
                                <ShareIcon size={19} />
                                <span className="hidden sm:inline">Share</span>
                            </button>

                        </div>

                    </div>


                    {/* ================= AUTHOR CONTROLS ================= */}
                    {isAuthor && (
                        <div className="flex gap-3 pb-5">
                            <Link
                                to={`/edit-post/${post.$id}`}
                                className="rounded-xl bg-volt px-5 py-2.5 text-sm font-semibold text-black hover:brightness-110 transition"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={deletePost}
                                className="rounded-xl border border-coral/40 px-5 py-2.5 text-sm font-semibold text-coral hover:bg-coral/10 transition"
                            >
                                Delete
                            </button>

                        </div>
                    )}
                </div>
                </article>

                {/* ================= COMMENTS ================= */}
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between px-1">
                        <h3 className="font-display text-lg font-semibold text-white">Replies</h3>
                        <button
                            onClick={()=>setShowCommentBox(true)}
                            className="rounded-xl bg-white/5 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-volt hover:text-black transition"
                        >
                            + Add reply
                        </button>
                    </div>
                        <ShowComment comments={comments} />
                </div>

              </div>
            </Container>
            {showCommentBox && (<CommentBox post={post} onCommentAdded={(newComment) => {
                setComments((prev) => [...prev, newComment])
                setCommentCount((prev) => prev + 1);
            }} onclose={()=>setShowCommentBox(false)} />)}
        </div>
    )
}
