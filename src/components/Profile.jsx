import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import EditProfile from './EditProfile';
import {profileAppwrite }from '../appwrite/profileConfig';
import defaultCoverImage from '../assets/jplenio-nature-3082832_1920.jpg';
import defaultProfileImage from '../assets/wolf69w-nature-10184389.jpg';
import { setCurrentProfile, addProfile } from '../store/profileSlice';
import followAppwrite from '../appwrite/followConfig';
import { ArrowLeftIcon, MoreIcon, MessageIcon, VerifiedIcon, CalendarIcon, PinIcon } from './Icons';

function Profile() {
    const userData = useSelector((state) => state.auth.userData);
    const [showEditProfile, setShowEditProfile] = useState(false);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    const { userId } = useParams();
    const [isFollowing, setIsFollowing] = useState(false);
    const [follower, setFollower] = useState(0);
    const [following, setFollowing] = useState(0);
    const [followLoading, setFollowLoading] = useState(true);

    const dispatch = useDispatch();

    const followerId = userData?.$id;
    const followingId = userId;

    console.log(followerId, followingId);


    console.log(userId);

    useEffect(() => {
        if (!userId) return;

        const fetchProfile = async () => {
            try {
                const profileData = await profileAppwrite.getProfile(userId);
                console.log(profileData);

                if (profileData) {
                    dispatch(addProfile(profileData));
                    dispatch(setCurrentProfile(profileData));
                }
            } catch (error) {
                console.error('Failed to fetch profile:', error);
            }
        };

        fetchProfile();
    }, [userId]);

    useEffect(() => {
        if (!userId) return;
        appwriteService.getPosts([])
            .then((res) => {
                const authorPosts = res?.documents?.filter((post) => post.userid === userId) ?? [];
                setPosts(authorPosts);
            })
            .catch((error) => {
                console.error('Failed to fetch posts:', error);
            });
    }, [userId]);

    useEffect(() => {
        if (!followerId || !followingId) {
            return;
        }

        if (followerId === followingId) {
            setFollowLoading(false);
            return;
        }

        const checkFollow = async () => {
            setFollowLoading(true)
            const result = await followAppwrite.checkFollowing({ followerId, followingId });

            if (!result) {
                return;
            }
            console.log(result);

            setIsFollowing(result.documents.length > 0);
            setFollowLoading(false);
        };

        checkFollow();
    }, [followerId, followingId]);

    const handleFollow = async () => {
        if (!followerId || !followingId) {
            return;
        }

        if (followerId === followingId) {
            return;
        }

        setFollowLoading(true);
        try {
            // Check database one more time
            const existing = await followAppwrite.checkFollowing({
                followerId,
                followingId
            });

            if (existing?.documents?.length > 0) {
                setIsFollowing(true);
                return;
            }

            // Create follow
            const result = await followAppwrite.followUser({
                followerId,
                followingId
            });

            if (result) {
                setIsFollowing(true);

                // Refresh follower count
                handlegetFollower();
            }

        } finally {
            setFollowLoading(false);
        }
    }

    const handleUnfollow = async () => {
        if (!followerId || !followingId) {
            return;
        }

        setFollowLoading(true);

        try {
            const result = await followAppwrite.UnFolloweUser({
                followerId,
                followingId
            });
            if (result) {
                setIsFollowing(false);
                handlegetFollower();
            }
        } finally {
            setFollowLoading(false);
        }
    };

    const handlegetFollower = async () => {
        const result = await followAppwrite.getFollower(followingId);
        if (!result) {
            return;
        }

        console.log(result);

        setFollower(result.documents.length);
    }

    const handlegetFollowing = async() =>{
        const result = await followAppwrite.getFollowing(followingId);

        if (!result) {
            return;
        }
        console.log(result);

        setFollowing(result.documents.length);
    }

    useEffect(() => {
        if (!userData?.$id || !userId) return;

        handlegetFollower();
        handlegetFollowing();
    }, [userData?.$id, userId]);


    const profile = useSelector((state) => state.profile.currentProfile);

    const userName = profile?.profileName;
    const loggedInUserName = userData?.name;
    const profileImageUrl = profile?.profileImage ? profileAppwrite.getFileView(profile.profileImage) : defaultProfileImage;
    const coverImageUrl = profile?.coverImage ? profileAppwrite.getFileView(profile.coverImage) : defaultCoverImage;



    if (!profile) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-zinc-400">
                <div className="h-10 w-10 rounded-xl bg-linear-to-br from-volt to-iris animate-spin" />
                Loading profile...
            </div>
        );
    }

    const handle = userName?.replace(/\s+/g, "_").toLowerCase();

    return (
        <div className="mx-auto max-w-3xl pt-4 text-zinc-100 animate-rise">
            {/* ================= TOP BAR ================= */}
            <div className="mb-3 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="grid h-10 w-10 place-items-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/6 transition"
                >
                    <ArrowLeftIcon size={20} />
                </button>

                <div className="leading-tight">
                    <h1 className="font-display font-semibold text-white">{userName}</h1>
                    <p className="text-xs text-zinc-500">{posts.length} posts</p>
                </div>
            </div>

            {/* ================= PROFILE CARD ================= */}
            <section className="surface overflow-hidden rounded-3xl">
                <div className="relative">
                    <div className="w-full h-44 sm:h-60 overflow-hidden">
                        <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-linear-to-t from-ink-900 via-ink-900/10 to-transparent" />
                    </div>

                    <div className="absolute left-5 sm:left-6 -bottom-14">
                        <div className="ring-gradient rounded-[30px] p-0.75 shadow-[0_20px_50px_-15px_rgba(139,124,255,0.6)]">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-[27px] overflow-hidden border-4 border-ink-900 bg-ink-800">
                                <img src={profileImageUrl} alt={userName} className="w-full h-full object-cover" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 px-5 sm:px-6 pt-4">
                    <button className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-zinc-300 hover:bg-white/6 transition">
                        <MoreIcon size={20} />
                    </button>

                    <button className="grid h-11 w-11 place-items-center rounded-xl border border-white/10 text-zinc-300 hover:bg-white/6 transition">
                        <MessageIcon size={19} />
                    </button>

                    <button
                        disabled={followLoading}
                        onClick={() => {
                            if (userData?.$id === userId) {
                                setShowEditProfile(true);
                            } else if (isFollowing) {
                                handleUnfollow();
                            } else {
                                handleFollow();
                            }
                        }}
                        className={`
                            group
                            px-6 py-2.5
                            rounded-xl
                            font-semibold
                            transition-all duration-200
                            disabled:opacity-50
                            disabled:cursor-not-allowed

                            ${
                                userData?.$id === userId
                                    ? "border border-white/15 text-white bg-white/4 hover:bg-white/4"
                                    : isFollowing
                                        ? "border border-white/15 text-white bg-transparent hover:border-coral hover:text-coral hover:bg-coral/10"
                                        : "bg-volt text-black hover:brightness-110 shadow-[0_8px_30px_-10px_rgba(212,255,58,0.7)]"
                            }
                        `}
                    >
                        {userData?.$id === userId ? (
                            "Edit Profile"
                        ) : followLoading ? (
                            "Loading..."
                        ) : isFollowing ? (
                            <>
                                {/* Normal */}
                                <span className="group-hover:hidden">
                                    Following
                                </span>

                                {/* Hover */}
                                <span className="hidden group-hover:inline">
                                    Unfollow
                                </span>
                            </>
                        ) : (
                            "Follow"
                        )}
                    </button>
                </div>

                <div className="px-5 sm:px-6 pt-6 pb-6">
                    <div className="flex items-center gap-2">
                        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{userName}</h2>
                        <VerifiedIcon size={20} className="text-volt" />
                    </div>

                    <p className="text-zinc-500">@{handle}</p>

                    <p className="mt-4 max-w-xl text-zinc-300 leading-7">{profile.bio || 'No bio available yet.'}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500">
                        {profile.address && (
                            <span className="inline-flex items-center gap-1.5"><PinIcon size={15} /> {profile.address}</span>
                        )}
                        <span className="inline-flex items-center gap-1.5"><CalendarIcon size={15} /> Joined August 2026</span>
                    </div>

                    {/* ================= STATS TILES ================= */}
                    <div className="mt-5 grid grid-cols-3 gap-2 sm:max-w-md">
                        <div className="rounded-2xl bg-white/3 border border-white/6 px-4 py-3">
                            <div className="font-display text-xl font-bold text-white">{posts.length}</div>
                            <div className="text-xs uppercase tracking-wider text-zinc-500">Posts</div>
                        </div>

                        <button
                            onClick={() =>
                                navigate(`/profile/${userId}/following`)
                            }
                            className="text-left rounded-2xl bg-white/3 border border-white/6 px-4 py-3 hover:border-volt/40 hover:bg-volt/6 transition"
                        >
                            <div className="font-display text-xl font-bold text-white">{ following}</div>
                            <div className="text-xs uppercase tracking-wider text-zinc-500">Following</div>
                        </button>

                        <button
                            onClick={() =>
                                navigate(`/profile/${userId}/followers`)
                            }
                            className="text-left rounded-2xl bg-white/3 border border-white/6 px-4 py-3 hover:border-volt/40 hover:bg-volt/6 transition"
                        >
                            <div className="font-display text-xl font-bold text-white">{ follower}</div>
                            <div className="text-xs uppercase tracking-wider text-zinc-500">Followers</div>
                        </button>
                    </div>
                </div>
            </section>

            {/* ================= TABS ================= */}
            <div className="mt-5 flex gap-1 rounded-2xl bg-white/3 border border-white/6 p-1">
                <button className="flex-1 rounded-xl py-2.5 text-sm font-semibold bg-volt text-black">Posts</button>
                <button className="flex-1 rounded-xl py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition">Replies</button>
                <button className="flex-1 rounded-xl py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition">Media</button>
                <button className="flex-1 rounded-xl py-2.5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/5 transition">Likes</button>
            </div>

            <div className="py-4">
                <div className="surface rounded-2xl p-4">
                    <div className="flex gap-3">
                        <img src={profileImageUrl} alt={userName} className="w-10 h-10 rounded-xl object-cover" />
                        <div>
                            <div className="flex gap-2 text-sm">
                                <span className="font-semibold text-white">{userName}</span>
                                <span className="text-zinc-500">@{userName}</span>
                            </div>
                            <p className="mt-1 text-zinc-300">This is my first post.</p>
                        </div>
                    </div>
                </div>
            </div>

            {showEditProfile && <EditProfile onClose={() => setShowEditProfile(false)} />}
        </div>
    );
}

export default Profile;
