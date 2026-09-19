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
import commentImg from "../assets/chatImg.png"
import tweetImg from "../assets/retweet.png"
import likeImg from "../assets/like.png"
import viewsImg from "../assets/visual.png"
import shareImg from "../assets/next.png";
import CommentBox from "../components/CommentBox";
import ShowComment from "../components/ShowComment";
import { setCurrentPost } from "../store/postSlice";

export default function Post() {
    const [post, setPost] = useState(null);
    // const [profile, setProfile] = useState();
    const [showCommentBox, setShowCommentBox] = useState(false);
    const { slug } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userid === userData.$id : false;


    const posts = useSelector((state) => state.post.posts)

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
                dispatch(setCurrentPost(postData))
            }
            else navigate("/");
        });
    
    },[posts,slug,navigate,dispatch])
    
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

    return (
        <div className="min-h-screen bg-black text-white py-4">
            <Container>
                {/* ================= USER INFORMATION ================= */}
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        {/* User */}
                        <div className="flex items-center gap-3">

                            <div className="w-12 h-12 rounded-full overflow-hidden">
                                <img
                                    src={profileImageUrl}
                                    alt="User"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <div>
                                <div className="flex items-center gap-1">
                                   <Link
                                        to={`/profile/${post.userid}`}
                                        onClick={()=>console.log("Profile Link clicked.")}
                                        className="text-white hover:underline"
                                    >
                                        {userName}
                                    </Link>

                                    {/* Verified badge */}
                                    <span className="text-blue-500 text-lg">
                                        ●
                                    </span>
                                </div>

                                <span className="text-gray-300">
                                    @{userName.replace(/\s+/g, "_").toLowerCase()}
                                </span>
                            </div>

                        </div>


                        {/* Right side */}
                        <div className="flex items-center gap-4 text-gray-400">

                            <button className="text-xl hover:text-white">
                                ◉
                            </button>

                            <button className="text-2xl hover:text-white">
                                ⋯
                            </button>

                        </div>

                    </div>
                </div>


                {/* ================= POST CONTENT ================= */}
                <div className="px-4">

                    <div className="text-lg leading-7 mb-5 text-white">
                        {parse(post.content)}
                    </div>


                    {/* ================= FEATURED IMAGE ================= */}
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFileView(
                                post.featuredImage
                            )}
                            alt={post.title}
                            className="w-full max-h-162.5 object-contain rounded-2xl"
                        />
                    </div>


                    {/* ================= DATE / VIEWS ================= */}
                    <div className="text-gray-500 text-sm py-3">
                        8:34 PM · Aug 12, 2026 ·{" "}
                        <span className="text-gray-300 font-semibold">
                            64.6K Views
                        </span>
                    </div>


                    {/* ================= ACTION BAR ================= */}
                    <div className="border-t border-b border-gray-800 py-4">

                        <div className="flex items-center justify-between text-gray-500">

                            {/* Comment */}
                            <button onClick={()=>setShowCommentBox(true)} className="flex items-center gap-2 hover:text-blue-400">
                                <span className="text-2xl">
                                    <img src={commentImg}
                                        className="size-8"
                                    />
                                </span>
                                <span>
                                    13
                                </span>
                            </button>


                            {/* Repost */}
                            <button className="flex items-center gap-2 hover:text-green-400">
                                <span className="text-2xl">
                                    <img src={tweetImg} className="size-8" />
                                </span>
                                <span>
                                    180
                                </span>
                            </button>


                            {/* Like */}
                            <button className="flex items-center gap-2 hover:text-pink-500">
                                <span className="text-2xl">
                                    <img src={likeImg} className="size-8" />
                                </span>
                                <span>
                                    696
                                </span>
                            </button>


                            {/* views*/}
                            <button className="flex items-center gap-2 hover:text-yellow-400">
                                <span className="text-2xl">
                                    <img src={viewsImg} className="size-8" />
                                </span>
                                <span>
                                    1.6K
                                </span>
                            </button>


                            {/* Share */}
                            <button className="text-2xl hover:text-blue-400">
                                <img src={shareImg} className="size-8" />
                            </button>

                        </div>

                    </div>


                    {/* ================= AUTHOR CONTROLS ================= */}
                    {isAuthor && (
                        <div className="flex gap-3 mt-5">
                            <Link
                                to={`/edit-post/${post.$id}`}
                                className="px-5 py-2 bg-green-600 rounded-full hover:bg-green-700"
                            >
                                Edit
                            </Link>

                            <button
                                onClick={deletePost}
                                className="px-5 py-2 bg-red-600 rounded-full hover:bg-red-700"
                            >
                                Delete
                            </button>

                        </div>
                    )}
                    {/* ================= COMMENTS ================= */}
                    <ShowComment/>

                </div>
            </Container>
            {showCommentBox && (<CommentBox post={post} onclose={()=>setShowCommentBox(false)} />)}
        </div>
    )
}