import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import defaultAvatar from "../assets/wolf69w-nature-10184389.jpg";
import { appwriteReply } from "../appwrite/commentReply";
import { profileAppwrite } from "../appwrite/profileConfig";
import { useEffect } from "react";
/**
 * Shows a "View replies" button under a comment.
 * Click once -> loads and shows the replies. Click again -> hides them.
 *
 * Props:
 *  - commentId : $id of the parent comment
 */
function ShowCommentReply({commentId,refresh}) {
  const [open, setOpen] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");

  const profiles = useSelector((state) => state.profile.profiles);
/*
  const handleToggle = async () => {
    // hide
    if (open) {
      setOpen(false);
      return;
    }

    // show (fetch only the first time)
    setOpen(true);
    if (loaded) return;

    setLoading(true);
    setError("");
    try {
      const res = await appwriteReply.getReplys(commentId);
      setReplies(res?.documents || []);
      setLoaded(true);
    } catch (err) {
      console.error("Failed to fetch replies", err);
      setError("Couldn't load replies. Try again.");
    } finally {
      setLoading(false);
    }
  };
*/
  
  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!open) return;

    const fetchReplies = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await appwriteReply.getReplys(commentId);

        setReplies(res?.documents || []);
        setLoaded(true);
      } catch (err) {
        console.error("Failed to fetch replies", err);
        setError("Couldn't load replies. Try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [open, refresh, commentId]);

  const getAvatar = (userId) => {
    const profile = profiles?.find((p) => p.$id === userId);
    return profile?.profileImage
      ? profileAppwrite.getFileView(profile.profileImage)
      : defaultAvatar;
  };

  const label = open ? "Hide replies" : "View replies";

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 -ml-2 text-sm font-medium text-zinc-500 transition hover:text-white hover:bg-white/6"
      >
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        <span>{label}</span>
      </button>

      {open && (
        <div className="mt-2 ml-4 space-y-3 border-l border-white/8 pl-4">
          {loading && (
            <p className="text-sm text-zinc-500">Loading replies...</p>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-coral">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setTimeout(handleToggle, 0);
                }}
                className="underline hover:text-white"
              >
                Retry
              </button>
            </div>
          )}

          {!loading && !error && loaded && replies.length === 0 && (
            <p className="text-sm text-zinc-500">No replies yet.</p>
          )}

          {replies.map((reply) => (
            <div key={reply.$id} className="flex gap-3">
              <img
                src={getAvatar(reply.userId)}
                alt={reply.userName || "User"}
                className="h-8 w-8 shrink-0 rounded-[10px] object-cover bg-ink-800"
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <Link
                    to={`/profile/${reply.userId}`}
                    className="font-semibold text-white transition-colors hover:text-volt"
                  >
                    {reply.userName}
                  </Link>
                  <span className="truncate text-zinc-500">
                    @{reply.userName?.replace(/\s+/g, "_").toLowerCase()}
                  </span>
                </div>

                {reply.reply && (
                  <p className="mt-1 whitespace-pre-wrap wrap-break-words text-left text-[15px] leading-6 text-zinc-200">
                    {reply.reply}
                  </p>
                )}

                {reply.Image && (
                  <img
                    src={appwriteReply.getFileView(reply.Image)}
                    alt="Reply"
                    className="mt-3 max-h-72 w-full max-w-sm rounded-xl border border-white/6 object-cover"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ShowCommentReply;