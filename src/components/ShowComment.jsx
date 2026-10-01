import React from 'react'
import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import { appwriteComment } from "../appwrite/commentConfig";
import profileAppwrite from '../appwrite/profileConfig';
import userImage from "../assets/wolf69w-nature-10184389.jpg";
import { useSelector,useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setComments } from '../store/commentSlice';
import { CommentIcon, RepostIcon, HeartIcon, EyeIcon, ShareIcon, BookmarkIcon, MoreIcon } from './Icons';
import timeAgo from '../utils/timeAgo';
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

  const act = "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-zinc-500 transition";

  return (
     <div className="space-y-3 text-zinc-100">
            {comments.length === 0 && (
                <div className="rounded-3xl border border-dashed border-white/10 px-6 py-10 text-center text-zinc-500">
                    No replies yet — start the conversation.
                </div>
            )}
            {comments.map((comment) => {
                return (
                    <div
                        key={comment.$id}
                        className="surface w-full rounded-2xl px-4 py-4 animate-rise"
                    >
                        <div className="flex gap-3">
                            {/* PROFILE IMAGE */}
                            <img
                                src={profileImages[comment.userId]|| userImage}
                                alt={comment.userName}
                                className="
                                    w-10
                                    h-10
                                    rounded-xl
                                    object-cover
                                    shrink-0
                                    bg-ink-800
                                "
                            />
                            {/* COMMENT CONTENT */}
                            <div className="flex-1 min-w-0">
                                {/* USER INFORMATION */}
                                <div className="flex items-center gap-2 text-sm">

                                    <Link
                                        to={`/profile/${comment.userId}`}
                                        className="font-semibold text-white hover:text-volt transition-colors"
                                    >
                                        {comment.userName}
                                    </Link>

                                    <span className="text-zinc-500 truncate">
                                        @{comment.userName
                                            ?.replace(/\s+/g, "_")
                                            .toLowerCase()}
                                    </span>

                                    <span className="text-zinc-600">
                                        · {timeAgo(comment.$createdAt)}
                                    </span>

                                    <button
                                        className="
                                            ml-auto
                                            grid h-8 w-8 place-items-center rounded-lg
                                            text-zinc-500
                                            hover:text-white hover:bg-white/6
                                        "
                                    >
                                        <MoreIcon size={18} />
                                    </button>

                                </div>
                                {/* COMMENT TEXT */}

                                {comment.reply && (
                                    <p className="mt-1 text-zinc-200 text-[15px] leading-6 text-left whitespace-pre-wrap wrap-break-words">
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
                                            w-full
                                            max-w-md
                                            max-h-80
                                            rounded-xl
                                            object-cover
                                            border border-white/6
                                        "
                                    />

                                )}
                                {/* ACTION BAR */}
                                <div className="
                                    flex
                                    items-center
                                    gap-1
                                    mt-3
                                    -ml-2
                                    text-sm
                                ">
                                    {/* Like */}
                                    <button className={`${act} hover:text-coral hover:bg-coral/10`}>
                                        <HeartIcon size={16} />
                                        <span>
                                            1
                                        </span>
                                    </button>
                                    {/* Reply */}
                                    <button className={`${act} hover:text-iris hover:bg-iris/10`}>
                                        <CommentIcon size={16} />
                                        <span>
                                            1
                                        </span>
                                    </button>
                                    {/* Repost */}
                                    <button className={`${act} hover:text-volt hover:bg-volt/10`}>
                                        <RepostIcon size={16} />
                                    </button>
                                    {/* Views */}
                                    <button className={`${act} hover:text-white`}>
                                        <EyeIcon size={16} />
                                        <span>
                                            86
                                        </span>
                                    </button>

                                    <div className="ml-auto flex items-center gap-1">
                                        {/* Bookmark */}
                                        <button className={`${act} hover:text-white hover:bg-white/6`}>
                                            <BookmarkIcon size={16} />
                                        </button>

                                        {/* Share */}
                                        <button className={`${act} hover:text-volt hover:bg-volt/10`}>
                                            <ShareIcon size={16} />
                                        </button>
                                    </div>
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
