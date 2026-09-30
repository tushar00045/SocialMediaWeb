import React, { useState ,useEffect} from "react";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import profileAppwrite from "../appwrite/profileConfig";
import { appwriteComment, AppwriteComment } from "../appwrite/commentConfig";
import defaultProfileImage from '../assets/wolf69w-nature-10184389.jpg';
import { CloseIcon, ImageIcon, SmileIcon, PollIcon, ClockIcon, PinIcon, FlagIcon } from "./Icons";
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

    // display only: show post text without HTML tags in the preview
    const plainContent = post?.content?.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").trim();

    const tool = "grid h-10 w-10 place-items-center rounded-xl text-zinc-500 hover:text-volt hover:bg-volt/10 transition";

    return (
      <form onSubmit={handleSubmit(replyPost)} >
        <div className="fixed inset-0 z-50 flex items-end sm:items-start justify-center bg-black/70 backdrop-blur-sm sm:pt-16">
            {/* ================= MODAL ================= */}
            <div
                className="
                    animate-rise
                    relative
                    w-full
                    max-w-2xl
                    bg-ink-900
                    text-zinc-100
                    rounded-t-3xl sm:rounded-3xl
                    border border-white/8
                    shadow-[0_40px_120px_-30px_rgba(139,124,255,0.45)]
                    overflow-hidden
                "
            >
                {/* ================= HEADER ================= */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/6">
                        <button
                        type="button"
                        onClick={onclose}
                        className="grid h-10 w-10 place-items-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/6 transition"
                        >
                        <CloseIcon size={20} />
                    </button>

                    <span className="font-display font-semibold text-white">New reply</span>

                    <button
                        type="button"
                        className="rounded-lg px-3 py-1.5 text-sm font-semibold text-iris hover:bg-iris/10 transition"
                    >
                        Drafts
                    </button>
                </div>
                {/* ================= ORIGINAL POST ================= */}
                <div className="px-5 pt-5">
                    <div className="flex gap-3">
                        {/* PROFILE IMAGE */}
                        <div className="flex flex-col items-center">
                            <img
                            src={postOwnerProfileImage}
                                alt="Profile"
                                className="w-11 h-11 rounded-[14px] object-cover bg-ink-800"
                            />
                            <span className="mt-2 w-0.5 flex-1 rounded-full bg-linear-to-b from-iris/60 to-transparent" />
                        </div>
                        {/* POST */}
                        <div className="flex-1 min-w-0 pb-4">
                            <div className="flex items-center gap-2 text-sm">

                                <span className="font-semibold text-white">
                                    {post?.userName || "User"}
                                </span>

                                <span className="text-zinc-500">
                                    @{post?.userName?.replace(/\s+/g, "_").toLowerCase()}
                                </span>

                                <span className="text-zinc-600">
                                    · 3h
                                </span>

                            </div>

                            <p className="mt-1 text-zinc-300 line-clamp-3">
                                {plainContent || "Original post"}
                            </p>

                            {/* ================= REPLY LINE ================= */}
                            <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-white/4 px-3 py-1 text-xs text-zinc-400">
                                Replying to{" "}
                                <span className="text-volt font-medium">
                                    @{post?.userName?.replace(/\s+/g, "_").toLowerCase()}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
                {/* ================= COMMENT INPUT ================= */}
                    <div className="flex gap-3 px-5">
                        {/* CURRENT USER IMAGE */}
                        <div className="ring-gradient h-fit rounded-2xl p-0.5">
                            <img
                                src={userProfileImage}
                                alt="You"
                                className="w-10 h-10 rounded-xl object-cover bg-ink-800"
                            />
                        </div>
                        {/* TEXTAREA */}
                        <textarea
                            {...register('reply', {
                                required:true
                            })}
                            autoFocus
                            placeholder="Write something thoughtful…"
                            className="
                                flex-1
                                min-h-32
                                bg-transparent
                                text-lg
                                leading-7
                                text-white
                                placeholder-zinc-600
                                resize-none
                                outline-none
                                pt-2
                            "
                        />
                    </div>

                    {/* ================= BOTTOM BAR ================= */}
                    <div className="flex items-center justify-between gap-3 mt-4 px-4 py-3 border-t border-white/6 bg-black/20">

                        {/* ICONS */}
                        <div className="flex items-center gap-0.5 overflow-x-auto">

                            <label className={`${tool} cursor-pointer`} title="Add image">
                                <ImageIcon size={19} />

                                <input
                                    type="file"
                                    accept="image/png,image/jpeg,image/jpg,image/gif"
                                    className="hidden"
                                    {...register("Image")}
                                />
                            </label>

                            <button
                                type="button"
                                className={`${tool} text-[11px] font-bold`}
                            >
                                GIF
                            </button>

                            <button type="button" className={tool}>
                                <PollIcon size={19} />
                            </button>

                            <button type="button" className={tool}>
                                <SmileIcon size={19} />
                            </button>

                            <button type="button" className={`${tool} hidden sm:grid`}>
                                <ClockIcon size={19} />
                            </button>

                            <button type="button" className={`${tool} hidden sm:grid`}>
                                <PinIcon size={19} />
                            </button>

                            <button type="button" className={`${tool} hidden sm:grid`}>
                                <FlagIcon size={19} />
                            </button>

                        </div>

                        {/* REPLY BUTTON */}
                        <button
                            type="submit"
                            // disabled={!comment.trim()}
                            className="
                                shrink-0
                                px-6
                                py-2.5
                                rounded-xl
                                bg-volt
                                text-black
                                font-semibold
                                hover:brightness-110
                                active:scale-95
                                transition
                                disabled:bg-ink-600
                                disabled:text-zinc-500
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
