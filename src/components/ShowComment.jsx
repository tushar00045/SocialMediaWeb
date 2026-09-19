import React from 'react'
import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import { appwriteComment } from "../appwrite/commentConfig";
import profileAppwrite from '../appwrite/profileConfig';
import userImage from "../assets/wolf69w-nature-10184389.jpg";
import commentImg from "../assets/chatImg.png"
import tweetImg from "../assets/retweet.png"
import likeImg from "../assets/like.png"
import viewsImg from "../assets/visual.png"
import shareImg from "../assets/next.png";
import bookmark from "../assets/bookmark.png"
import { useSelector,useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setComments } from '../store/commentSlice';

function ShowComment() {
  const [profileImages, setProfileImages] = useState({});
    const { slug } = useParams();

    const dispatch = useDispatch();
    
    const comments = useSelector((state) => state.comment.comments);

  useEffect(() => { 
    if (!slug) return;
      const fetchComment = async () => {
        try {
          const result = await appwriteComment.getComments(slug)
      
          console.log("Comments", result.documents);
          dispatch(setComments(result.documents));
        } catch (error) {
          console.error("Failed to Fetch the comment", error);
        }
    }
    
    fetchComment();
  }, [slug])

  // if (comments.length === 0) return;
  
    const profiles = useSelector((state) => state.profile.profiles);
    
    useEffect(() => {
        const fetchProfileImages = async () => {
            const images = [];
        
            for (const comment of comments) {
                try {
                    console.log(comment.userId);
                    const profile = profiles.find((prof) => prof.$id === comment.userId);
                    // console.log(profile);
                    // console.log(`Profile for:${comment.userId},${profile}`);

                    if (profile?.profileImage) {
                        images[comment.userId] = await profileAppwrite.getFileView(profile?.profileImage);
                    }
                    else {
                        images[comment.userId] = userImage;
                    }
                } catch (error) {
                    console.error("Failed to fetch profile:", error);
                    images[comment.userId] = userImage;
                }
            }

            setProfileImages(images);
        }

        fetchProfileImages();

    }, [comments, profiles]);
  
  return (
     <div className="text-white">
            {comments.map((comment) => {
                return (
                    <div
                        key={comment.$id}
                        className="w-full border-b border-gray-800 px-4 py-3"
                    >
                        <div className="flex gap-3">
                            {/* PROFILE IMAGE */}
                            <img
                                src={profileImages[comment.userId]|| userImage}
                                alt={comment.userName}
                                className="
                                    w-10
                                    h-10
                                    rounded-full
                                    object-cover
                                    shrink-0
                                "
                            />
                            {/* COMMENT CONTENT */}
                            <div className="flex-1 min-w-0">
                                {/* USER INFORMATION */}
                                <div className="flex items-center gap-2">

                                    <Link
                                        to={`/profile/${comment.userId}`}
                                        className="font-bold hover:underline"
                                    >
                                        {comment.userName}
                                    </Link>

                                    <span className="text-gray-500 text-[14px]">
                                        @{comment.userName
                                            ?.replace(/\s+/g, "_")
                                            .toLowerCase()}
                                    </span>

                                    <span className="text-gray-500">
                                        · 2h
                                    </span>

                                    <button
                                        className="
                                            ml-auto
                                            text-gray-500
                                            hover:text-white
                                        "
                                    >
                                        ⋯
                                    </button>

                                </div>
                                {/* COMMENT TEXT */}

                                {comment.reply && (
                                    <p className="mt-1 text-gray-200 text-[22px] leading-5 text-left">
                                        {comment.reply}
                                    </p>
                                )}
                                {/* COMMENT IMAGE */}
                                {comment.Image && (
                                    <img
                                        src={appwriteComment.getFileView(comment.Image)}
                                        alt="Comment"
                                        className="
                                            mt-3
                                            max-w-md
                                            max-h-80
                                            rounded-xl
                                            object-cover
                                        "
                                    />

                                )}
                                {/* ACTION BAR */}
                                <div className="
                                    flex
                                    items-center
                                    justify-between
                                    mt-4
                                    max-w-lg
                                    text-gray-500
                                ">
                                    {/* Reply */}
                                    <button
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            hover:text-blue-400
                                        "
                                    >
                                        <span className="text-xl size-6">
                                         <img src={ commentImg} className="size-6" />
                                        </span>

                                        <span className="text-sm">
                                            1
                                        </span>

                                    </button>
                                    {/* Repost */}
                                    <button
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            hover:text-green-400
                                        "
                                    >
                                        <span className="text-xl size-6">
                                                                                  <img src={tweetImg} className="size-6" />
                                        </span>

                                    </button>
                                    {/* Like */}
                                    <button
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            hover:text-pink-500
                                        "
                                    >
                                        <span className="text-xl size-6">
                                                                                    <img src={likeImg} className="size-6" />
                                        </span>

                                        <span className="text-sm">
                                            1
                                        </span>

                                    </button>


                                    {/* Views */}

                                    <button
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                            hover:text-blue-400
                                        "
                                    >
                                        <span className="text-xl size-6">
                                                                                     <img src={viewsImg} className="size-6" />
                                        </span>

                                        <span className="text-sm">
                                            86
                                        </span>

                                    </button>

                                    {/* Bookmark */}

                                    <button
                                        className="
                                            text-xl
                                            hover:text-white
                                        "
                                    >
                                                                                 <img src={bookmark} className="size-6" />
                                    </button>

                                    {/* Share */}

                                    <button
                                        className="
                                            text-xl
                                            hover:text-blue-400
                                        "
                                    >
                                                                                 <img src={shareImg} className="size-6" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
          })}
    </div>
  )
}

export default ShowComment
