import React, { useState,useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import profileAppwrite from '../appwrite/profileConfig';
import AppwriteService from "../appwrite/config";
import { useSelector } from 'react-redux';
import followAppwrite from '../appwrite/followConfig';
import defaultProfileImage from "../assets/wolf69w-nature-10184389.jpg"
import { ArrowLeftIcon } from '../components/Icons';

function Follow() {
  const {userId,type} = useParams();
  console.log(userId);

  const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [myfollowingIds, setMyfollowingIds] = useState([]);

  const followingId = userId;

    const profiles = useSelector((state) => state.profile.profiles);

    const userData = useSelector((state) => state.auth.userData);

  const currentProfile = profiles.find((profile) => profile?.$id === userId);

  const profileName = currentProfile?.profileName;

  console.log(profileName);

    const handlegetFollower = async () => {
        const result = await followAppwrite.getFollower(followingId);
        if (!result) {
            return;
        }

      console.log(result);
        console.log(result.documents);

        const followerIds = result.documents.map((document) => document.followerId);
        console.log(followerIds);
        setFollowers(followerIds);
    }

    const handlegetFollowing = async() =>{
        const result = await followAppwrite.getFollowing(followingId);

        if (!result) {
            return;
        }
        console.log(result);
        console.log(result.documents);

        const followingIds = result.documents.map((document) => document.followingId);
        console.log(followingIds);
        setFollowing(followingIds);
    }

    const handleGetMyFollowing = async () => {
        if (!userData?.$id) {
            return;
        }

        const result = await followAppwrite.getFollowing(userData?.$id);

        if (!result) {
            return;
        }

        const ids = result.documents.map((document) =>
            document.followingId
        )

        setMyfollowingIds(ids);
    }

    const IsFollowing = (profileId)=>{
        return myfollowingIds.includes(profileId);
    }

    const handleFollow = async (profileId) => {
        if (!userData?.$id || !profileId) return;

        if (userData?.$id === profileId) {
            return;
        }

        const alreadyFollowing = myfollowingIds.includes(profileId);

        if (alreadyFollowing) {
            const result = await followAppwrite.UnFolloweUser({
                followerId: userData.$id,
                followingId: profileId
            });

            if (result) {
                setMyfollowingIds((prev) =>
                    prev.filter((id) => id !== profileId)
                );
            }
        } else {
            const result = await followAppwrite.followUser({
                followerId: userData.$id,
                followingId: profileId
            });

            if (result) {
                setMyfollowingIds((prev) => [
                    ...prev,
                    profileId
                ]);
            }
        };
    }

    const followersProfile = profiles.filter((profile) =>
        followers.includes(profile?.$id)
    );
    console.log({followersProfile});

    const followingProfile = profiles.filter((profile) =>
        following.includes(profile?.$id)
    );
    console.log({followingProfile});

    useEffect(() => {
        if (!userId) return;

        if (type === "followers") {
            handlegetFollower();
        } else if (type === "following") {
            handlegetFollowing();
        }
    }, [userId, type]);

    useEffect(() => {
       handleGetMyFollowing();
    }, [userData?.$id]);


  const navigate = useNavigate();

    // ---------- presentational helpers (no logic change) ----------
    const followBtnClass = (profileId) => `group shrink-0 px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
        IsFollowing(profileId)
            ? "border border-white/15 text-white bg-transparent hover:border-coral hover:text-coral hover:bg-coral/10"
            : "bg-volt text-black hover:brightness-110"
    }`;

    const FollowLabel = ({ profileId }) => IsFollowing(profileId) ? (
        <>
            <span className="group-hover:hidden">
                Following
            </span>

            <span className="hidden group-hover:inline">
                Unfollow
            </span>
        </>
    ) : (
        "Follow"
    );

    const PersonRow = ({ profile, children }) => (
        <div
            className="surface flex items-center gap-4 rounded-2xl px-4 py-3.5 hover:border-white/[0.12] transition animate-rise"
        >
            <button onClick={() => navigate(`/profile/${profile?.$id}`)} className="shrink-0">
                <img
                    src={profile?.profileImage ? profileAppwrite.getFileView(profile.profileImage) : defaultProfileImage}
                    alt="Profile"
                    className="w-12 h-12 rounded-[14px] object-cover bg-ink-800"
                />
            </button>

            <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-white truncate">
                    {profile?.profileName}
                </h2>

                <p className="text-zinc-500 text-sm truncate">
                    {profile?.bio}
                </p>
            </div>

            {children}
        </div>
    );

    const Empty = ({ text }) => (
        <div className="rounded-3xl border border-dashed border-white/10 px-6 py-14 text-center">
            <h2 className="text-zinc-400">{text}</h2>
        </div>
    );

    return (
        <div className="mx-auto max-w-2xl px-3 sm:px-0 py-5 text-zinc-100">
            {/* ================= HEADER ================= */}
            <div className="mb-5">

                {/* Top Header */}
                <div className="flex items-center gap-3 mb-4">
                    {/* Back Button */}
                    <button onClick={()=>navigate(-1)} className="grid h-10 w-10 place-items-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.06] transition">
                        <ArrowLeftIcon size={20} />
                    </button>

                    {/* Profile Name */}
                    <div className="leading-tight">
                        <h1 className="font-display text-xl font-bold text-white">
                            {profileName}
                        </h1>
                        <p className="text-sm text-zinc-500">
                            @{profileName?.replace(/\s+/g, "_").toLowerCase()}
                        </p>
                    </div>

                </div>
                {/* ================= TABS ================= */}
                <div className="flex gap-1 rounded-2xl bg-white/[0.03] border border-white/[0.06] p-1">
            <button
              onClick={()=> navigate(`/profile/${userId}/followers`)}
                        className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                            type === "followers"
                                ? "bg-volt text-black"
                                : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                        }`}
                    >
                        Followers
                    </button>

            <button
              onClick={()=>navigate(`/profile/${userId}/following`)}
                        className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                            type === "following"
                                ? "bg-volt text-black"
                                : "text-zinc-400 hover:text-white hover:bg-white/[0.05]"
                        }`}
                    >
                        Following
                    </button>

                </div>
            </div>

            <div className="w-full space-y-2.5">

            {type === "followers"
                    ? followersProfile.length > 0?followersProfile.map((profile) =>(
                    <PersonRow key={profile?.$id} profile={profile}>
                        {profile?.$id!== userData?.$id &&(<button
                            onClick={() => handleFollow(profile?.$id)}
                            className={followBtnClass(profile?.$id)}
                        >
                            <FollowLabel profileId={profile?.$id} />
                        </button>)}
                    </PersonRow>
                )) : (<Empty text="You Don`t have Any Followers yet." />)
                : followingProfile.length>0?followingProfile.filter((profile)=> profile.$id!==userData.$id).map((profile) => (
                    <PersonRow key={profile?.$id} profile={profile}>
                        <button
                            onClick={() => handleFollow(profile?.$id)}
                            className={followBtnClass(profile?.$id)}
                        >
                            <FollowLabel profileId={profile?.$id} />
                        </button>
                    </PersonRow>
                )) : (<Empty text="You Are Not Following AnyOne yet." />)
            }
            </div>
        </div>
    );
}

export default Follow;
