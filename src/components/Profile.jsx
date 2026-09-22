import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import appwriteService from '../appwrite/config';
import EditProfile from './EditProfile';
import profileAppwrite from '../appwrite/profileConfig';
import defaultCoverImage from '../assets/jplenio-nature-3082832_1920.jpg';
import defaultProfileImage from '../assets/wolf69w-nature-10184389.jpg';
import { setCurrentProfile, addProfile } from '../store/profileSlice';
import followAppwrite from '../appwrite/followConfig';

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
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="sticky top-0 z-10 bg-black/90 backdrop-blur-md">
                <div className="flex items-center gap-6 px-5 py-3">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-900 text-2xl"
                    >
                        ←
                    </button>

                    <div>
                        <h1 className="font-light text-shadow-indigo-700">{userName}</h1>
                        <p className="text-sm text-gray-500">11.3K posts</p>
                    </div>
                </div>
            </div>

            <div className="relative">
                <div className="w-full h-64 overflow-hidden">
                    <img src={coverImageUrl} alt="Cover" className="w-full h-full object-cover" />
                </div>

                <div className="absolute left-5 -bottom-16">
                    <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-black bg-gray-800">
                        <img src={profileImageUrl} alt={userName} className="w-full h-full object-cover" />
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 px-5 pt-4">
                <button className="w-12 h-12 rounded-full border border-gray-700 hover:bg-gray-900 text-xl">
                    ⋯
                </button>

                <button className="w-12 h-12 rounded-full border border-gray-700 hover:bg-gray-900 text-xl">
                    💬
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
                        px-6 py-2
                        rounded-full
                        font-bold
                        transition-all duration-200
                        disabled:opacity-50
                        disabled:cursor-not-allowed

                        ${
                            userData?.$id === userId
                                ? "bg-white text-black hover:bg-gray-200"
                                : isFollowing
                                    ? "border border-gray-500 text-white bg-transparent hover:border-red-500 hover:text-red-500"
                                    : "bg-white text-black hover:bg-gray-200"
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

            <div className="px-5 pt-5">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{userName}</h2>
                    <span className="text-blue-500 text-xl">●</span>
                </div>

                <p className="text-gray-500 text-lg">@{userName}</p>

                <p className="mt-4 text-gray-300">{profile.bio || 'No bio available yet.'}</p>

                <p className="mt-2 text-gray-500">Joined August 2026</p>

                <div className="flex gap-5 mt-4">
                  <button
                       onClick={() => 
                         navigate(`/profile/${userId}/following`)    
                       }
                    >          
                    <span className="font-bold text-white">{ following}</span>{' '}
                    <span className="text-gray-500">Following</span>
                    </button>

                    <button
                        onClick={() =>
                            navigate(`/profile/${userId}/followers`)
                        }
                    >
                    <span className="font-bold text-white">{ follower}</span>{' '}
                    <span className="text-gray-500">Followers</span>
                    </button>
                </div>
            </div>

            <div className="flex mt-6 border-b border-gray-800">
                <button className="flex-1 py-4 font-bold border-b-4 border-blue-500">Posts</button>
                <button className="flex-1 py-4 text-gray-500 hover:bg-gray-900">Replies</button>
                <button className="flex-1 py-4 text-gray-500 hover:bg-gray-900">Media</button>
                <button className="flex-1 py-4 text-gray-500 hover:bg-gray-900">Likes</button>
            </div>

            <div className="px-5 py-5">
                <div className="border-b border-gray-800 pb-5">
                    <div className="flex gap-3">
                        <img src={profileImageUrl} alt={userName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                            <div className="flex gap-2">
                                <span className="font-bold">{userName}</span>
                                <span className="text-gray-500">@{userName}</span>
                            </div>
                            <p className="mt-2 text-gray-300">This is my first post.</p>
                        </div>
                    </div>
                </div>
            </div>

            {showEditProfile && <EditProfile onClose={() => setShowEditProfile(false)} />}
        </div>
    );
}

export default Profile;
