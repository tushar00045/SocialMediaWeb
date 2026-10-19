import React from 'react'
import { useState, useEffect } from "react"
import { useParams } from 'react-router-dom';
import { appwriteComment } from "../appwrite/commentConfig";
import {profileAppwrite} from '../appwrite/profileConfig';
import userImage from "../assets/wolf69w-nature-10184389.jpg";
import { useSelector,useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setComments } from '../store/commentSlice';
import { AuthService } from '../appwrite/auth';
import { CommentIcon, RepostIcon, HeartIcon, EyeIcon, ShareIcon, BookmarkIcon, MoreIcon } from './Icons';
import timeAgo from '../utils/timeAgo';
import { appwriteCommentLike } from '../appwrite/likeCommentConfig';
import ShowCommentReply from './ShowCommentReply';
import CommentBox2 from './CommentBox2';
import { appwriteReply } from '../appwrite/commentReply';
import OptionsMenu from './OptionsMenu';
function ShowComment({comments}) {
    const [profileImages, setProfileImages] = useState({});
    const [commentLikeCounts, setCommentLikesCounts] = useState({});
    const { slug } = useParams();
    const [likedComments, setLikedComments] = useState({});
    const [showCommentBox, setShowCommentBox] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyRefresh, setReplyRefresh] = useState({});
    const [replyCount, setReplyCount] = useState({});
    const [editingComment, setEditingComment] = useState(null);
    const [editText, setEditText] = useState("");
    const [commentList, setCommentList] = useState(comments ?? []);

    useEffect(() => {
        setCommentList(comments ?? []);
    }, [comments]);
    
    const handleReplyCount = async (commentId) => {
        const result = await appwriteReply.getReplys(commentId);
        
        if (!result) {
            return;
        }
        console.log(result.documents);
        console.log(result.documents.length);
        setReplyCount((prev) => ({
            ...prev, [commentId]: result.documents.length
        }));
    }

    useEffect(() => {
        if (!comments.length) {
            return;
        }
        commentList.forEach((comment) => { 
            handleReplyCount(comment?.$id);
        });
    }, [comments]);



    const profiles = useSelector((state) => state.profile.profiles);
    
    const userData = useSelector((state) => state.auth.userData);

    useEffect(() => {
        const fetchProfileImages = async () => {
            const images = [];

            for (const comment of commentList) {
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

    }, [commentList, profiles]);
 //
    useEffect(() => {
        const loadLikedComments = async () => {
            if (!userData?.$id) return;

            const likedState = {};

            for (const comment of comments) {
                const result =
                    await appwriteCommentLike.getLikeUsers(comment.$id);

                if (!result) continue;

                likedState[comment.$id] =
                    result.documents.some(
                        (like) => like.userId === userData.$id
                    );
            }

            setLikedComments(likedState);
        };

        loadLikedComments();
    }, [comments, userData]);

    const handleCommentLikes = async (commentId) => {
        const result = await appwriteCommentLike.getLikeUsers(commentId);
        console.log(result);

        if (!result) {
            return;
        }

        const alreadyLiked = result.documents.some((like) => like.userId === userData?.$id);

        if (alreadyLiked) {
            //delete the entry from the commmentlike collection
            const deleteLike = await appwriteCommentLike.deleteLike({
                commentId:commentId,userId:userData?.$id
            })

            if (!deleteLike) {
                return;
            }

            setLikedComments((prev) => ({
                ...prev,
                [commentId]: false
            }));

            const updateComment = await appwriteComment.decrementCommentLikes(commentId);

            if (updateComment) {
                setCommentLikesCounts((prev) => ({
                    ...prev,
                    [commentId]:updateComment.likes
                }))
            }
        }

        else {
            //Add the Entry in the Like Collection
            const createLike = await appwriteCommentLike.createLike({
                commentId: commentId, userId: userData?.$id
            });

            if (!createLike) {
                return;
            }

            setLikedComments((prev) => ({
                ...prev,
                [commentId]: true
            }));

            const updateComment = await appwriteComment.incrementCommentLikes(commentId);

            console.log("UPDATED COMMENT:", updateComment);
            console.log("UPDATED LIKES:", updateComment?.likes);

            if (updateComment) {
                setCommentLikesCounts((prev) => ({
                    ...prev,
                    [commentId]:updateComment.likes
                }))
            }
        }
    }

    const handleDeleteComment = async (comment) => {
        if (comment.userId !== userData?.$id) return;

        const confirmed = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmed) return;

        try {
            const result = await appwriteComment.deleteComment(comment.$id);

            if (result) {
                setCommentList((prev) =>
                    prev.filter((item) => item.$id !== comment.$id)
                );
            }
        } catch (error) {
            console.error("Failed to delete comment:", error);
        }
    };

    const handleUpdateComment = async (comment) => {
        if (comment.userId !== userData?.$id) return;

        const newText = editText.trim();

        if (!newText) return;

        try {
            const updatedComment = await appwriteComment.updateComment(
                comment.$id,
                { reply: newText }
            );

            if (updatedComment) {
                setCommentList((prev) =>
                    prev.map((item) =>
                        item.$id === comment.$id
                            ? { ...item, ...updatedComment }
                            : item
                    )
                );

                setEditingComment(null);
                setEditText("");
            }
        } catch (error) {
            console.error("Failed to update comment:", error);
        }
    };

    const act = "flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-zinc-500 transition";

  return (
     <div className="space-y-3 text-zinc-100">
        {commentList.length === 0 && (
            <div className="rounded-3xl border border-dashed border-white/10 px-6 py-10 text-center text-zinc-500">
                No replies yet — start the conversation.
            </div>
        )}
        {commentList.map((comment) => {
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

                                {/* ... */}
                                {comment.userId === userData?.$id && (
                                    <div className="ml-auto shrink-0">
                                        <OptionsMenu
                                            options={[
                                                {
                                                    label: "Edit comment",
                                                    onClick: () => {
                                                        setEditingComment(comment.$id);
                                                        setEditText(comment.reply ?? "");
                                                    },
                                                },
                                                {
                                                    label: "Delete comment",
                                                    className: "hover:text-red-400",
                                                    onClick: () => handleDeleteComment(comment),
                                                },
                                            ]}
                                        />
                                    </div>
                                )}

                            </div>
                            {/* COMMENT TEXT */}

                            {editingComment === comment.$id ? (
                                <div className="mt-3 space-y-3">
                                    <textarea
                                        value={editText}
                                        onChange={(event) => setEditText(event.target.value)}
                                        rows={3}
                                        className="w-full resize-y rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none transition focus:border-volt"
                                        placeholder="Edit your comment..."
                                    />

                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setEditingComment(null);
                                                setEditText("");
                                            }}
                                            className="rounded-lg px-4 py-2 text-sm text-zinc-400 transition hover:text-white"
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleUpdateComment(comment)}
                                            className="rounded-lg bg-volt px-4 py-2 text-sm font-semibold text-black transition hover:brightness-110"
                                        >
                                            Save changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                comment.reply && (
                                    <p className="mt-1 whitespace-pre-wrap wrap-break-words text-left text-[15px] leading-6 text-zinc-200">
                                        {comment.reply}
                                    </p>
                                )
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
                                <button
                                    onClick={()=>handleCommentLikes(comment?.$id)}
                                    className={`${act} hover:text-coral hover:border-coral/40 hover:bg-coral/10 ${likedComments[comment?.$id] ? "text-coral border-coral/40 bg-coral/10" : ""}`}
                                >
                                    <HeartIcon size={19} fill={likedComments[comment?.$id] ? "currentColor" :
                                    "none"}
                                    className={likedComments[comment?.$id] ? "text-coral" : ""}/>
                                    <span>
                                        {commentLikeCounts[comment.$id] ?? comment.likes ?? 0}
                                    </span>
                                </button>
                                {/* Reply */}
                                <button onClick={()=>setReplyingTo(comment)} className={`${act} hover:text-iris hover:bg-iris/10`}>
                                    <CommentIcon size={16} />
                                    <span>
                                        {replyCount[comment.$id] || 0}
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
                            <ShowCommentReply commentId={comment.$id} refresh={replyRefresh[comment.$id] || 0} />
                        </div>
                    </div>
                </div>
            );
        })}      
        {replyingTo && (<CommentBox2
                comment={replyingTo}
              onCommentAdded={(newReply) => {
                  const parentId = replyingTo?.$id;
                  setReplyRefresh((prev) => ({
                      ...prev,
                      [parentId]: (prev[parentId] || 0) + 1
                  }));
                  setReplyCount((prev) => ({
                      ...prev,
                    [parentId]: (prev[parentId] || 0) + 1
                  }));
                  setReplyingTo(null);
                }}
                onclose={() => setReplyingTo(null)}
            />
        )}
    </div>
  )
}

export default ShowComment
