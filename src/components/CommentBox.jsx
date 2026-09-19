import React, { useState ,useEffect} from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import profileAppwrite from "../appwrite/profileConfig";
import { appwriteComment, AppwriteComment } from "../appwrite/commentConfig";
import defaultProfileImage from '../assets/wolf69w-nature-10184389.jpg';
function CommentBox({post,onclose}) {
    const [comment, setComment] = useState("");
    const { register, handleSubmit,reset } = useForm();
    const userData = useSelector((state) => state.auth.userData);
    const userId = userData?.$id;
    const postId = post.userid//on which post we want to comment
    console.log(userId)
    console.log(postId);

    const profiles = useSelector((state) => state.profile.profiles);
    // profile of who wrote the comment
    const profile = profiles.find((prof) => prof.$id === userId);
    
    
    // whom post Is commented
    const profile2 = profiles.find((prof)=>prof.$id===postId)
    
    
    const postOwnerProfileImage=profile2?.profileImage ? profileAppwrite.getFileView(profile2.profileImage) : defaultProfileImage;
    const userProfileImage = profile?.profileImage ? profileAppwrite.getFileView(profile.profileImage) : defaultProfileImage;
    

    const replyPost = async (data) => {
        try {
            let ImageId = null;
            const imageFile = data.Image?.[0];
            if (imageFile) {
                const uploadImage = await appwriteComment.uploadFile(imageFile);
                ImageId = uploadImage.$id;
            }
            
            console.log("comment:", comment);
            console.log(userData?.$id)
            console.log("Post ID:", post?.$id);

            const result = await appwriteComment.createComment({
                userId: userData?.$id,
                postId: post?.$id,
                Image: ImageId,
                reply: data?.reply,
                userName: userData?.name,
            })

            if (result) {
                console.log("CommentedCreated:", result);
                reset();

                onclose();
            }
        }
        catch (error) {
            console.log("creation Post is failed.", error)
        }
    };

    return (
      <form onSubmit={handleSubmit(replyPost)} >
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60">
            {/* ================= MODAL ================= */}
            <div
                className="
                    relative
                    w-full
                    max-w-2xl
                    mt-10
                    bg-black
                    text-white
                    rounded-2xl
                    shadow-2xl
                    overflow-hidden
                "
            >
                {/* ================= HEADER ================= */}
                <div className="flex items-center justify-between px-6 py-4">
                        <button
                        type="button"
                        onClick={onclose}
                        className="
                            w-10 h-10
                            flex items-center justify-center
                            rounded-full
                            text-3xl
                            hover:bg-gray-900
                        "
                        >
                        ×
                    </button>

                    <button
                        className="
                            text-blue-400
                            font-semibold
                            hover:text-blue-300
                        "
                    >
                        Drafts
                    </button>
                </div>
                {/* ================= ORIGINAL POST ================= */}
                <div className="px-6">
                    <div className="flex gap-3">
                        {/* PROFILE IMAGE */}
                        <img
                        src={postOwnerProfileImage}
                            alt="Profile"
                            className="
                                w-12 h-12
                                rounded-full
                                object-cover
                            "
                        />
                        {/* POST */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2">

                                <span className="font-bold">
                                    {post?.userName || "User"}
                                </span>

                                <span className="text-gray-500">
                                    @{post?.userName?.replace(/\s+/g, "_").toLowerCase()}
                                </span>

                                <span className="text-gray-500">
                                    · 3h
                                </span>

                            </div>

                            <p className="mt-1 text-gray-200">
                                {post?.content || "Original post"}
                            </p>
                        </div>
                    </div>
                    {/* ================= REPLY LINE ================= */}

                    <div className="ml-6 mt-2 border-l-2 border-gray-800 pl-6">

                        <p className="text-gray-500">
                            Replying to{" "}
                            <span className="text-blue-400">
                                @{post?.userName?.replace(/\s+/g, "_").toLowerCase()}
                            </span>
                        </p>
                    </div>
                </div>
                {/* ================= COMMENT INPUT ================= */}
                    <div className="flex gap-3">
                        {/* CURRENT USER IMAGE */}
                        <img
                            src={userProfileImage}
                            alt="You"
                            className="
                                w-12 h-12
                                rounded-full
                                object-cover
                            "
                        />
                        {/* TEXTAREA */}
                        <textarea
                            {...register('reply', {
                                required:true
                            })}
                            autoFocus
                            placeholder="Post your reply"
                            className="
                                flex-1
                                min-h-32
                                bg-transparent
                                text-xl
                                text-white
                                placeholder-gray-500
                                resize-none
                                outline-none
                            "
                        />
                    </div>

                    {/* ================= BOTTOM BAR ================= */}
                    <div className="flex items-center justify-between mt-6">

                        {/* ICONS */}
                        <div className="flex items-center gap-5 text-gray-500">

                            <label className="cursor-pointer text-2xl hover:text-blue-400">
                                ▧

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/gif"
                                    className="hidden"
                                    {...register("Image")}
                                />
                            </label>

                            <button
                                type="button"
                                className="text-sm font-bold hover:text-blue-400"
                            >
                                GIF
                            </button>

                            <button
                                type="button"
                                className="text-2xl hover:text-blue-400"
                            >
                                ◉
                            </button>

                            <button
                                type="button"
                                className="text-2xl hover:text-blue-400"
                            >
                                ☺
                            </button>

                            <button
                                type="button"
                                className="text-2xl hover:text-blue-400"
                            >
                                ◷
                            </button>

                            <button
                                type="button"
                                className="text-2xl hover:text-blue-400"
                            >
                                📍
                            </button>

                            <button
                                type="button"
                                className="text-2xl hover:text-blue-400"
                            >
                                ⚑
                            </button>

                        </div>

                        {/* REPLY BUTTON */}
                        <button
                            type="submit"
                            // disabled={!comment.trim()}
                            className="
                                px-6
                                py-3
                                rounded-full
                                bg-blue-500
                                text-black
                                font-bold
                                disabled:bg-gray-700
                                disabled:text-gray-500
                                disabled:cursor-not-allowed
                            "
                        >
                            Reply
                        </button>
                </div>
            </div>
        </div>
      </form>
    );
}

export default CommentBox;