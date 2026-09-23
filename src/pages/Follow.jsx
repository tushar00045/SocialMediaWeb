import React, { useState,useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import profileAppwrite from '../appwrite/profileConfig';
import AppwriteService from "../appwrite/config";
import { useSelector } from 'react-redux';
import followAppwrite from '../appwrite/followConfig';
import defaultProfileImage from "../assets/wolf69w-nature-10184389.jpg"

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
    return (
        <div className="min-h-screen bg-black text-white">
            {/* ================= HEADER ================= */}
            <div className="sticky top-0 z-20 bg-black/90 backdrop-blur-md">

                {/* Top Header */}
                <div className="flex items-center gap-5 px-6 py-4">
                    {/* Back Button */}
                    <button onClick={()=>navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full text-2xl hover:bg-gray-900 transition">
                        ←
                    </button>

                    {/* Profile Name */}
                    <div>
                        <h1 className="text-xl font-bold">
                            {profileName}
                        </h1>
                        <p className="text-sm text-gray-500">
                            @{profileName?.replace(/\s+/g, "_").toLowerCase()}
                        </p>
                    </div>

                </div>
                {/* ================= TABS ================= */}
                <div className="flex border-b border-gray-800">
            <button
              onClick={()=> navigate(`/profile/${userId}/followers`)}
                        className={`flex-1 py-4 font-bold transition ${
                            type === "followers"
                                ? "text-white border-b-4 border-blue-500"
                                : "text-gray-500 border-b-4 border-transparent hover:bg-gray-900"
                        }`}
                    >
                        Followers
                    </button>

            <button
              onClick={()=>navigate(`/profile/${userId}/following`)}
                        className={`flex-1 py-4 font-bold transition ${
                            type === "following"
                                ? "text-white border-b-4 border-blue-500"
                                : "text-gray-500 border-b-4 border-transparent hover:bg-gray-900"
                        }`}
                    >
                        Following
                    </button>

                </div>
            </div>
        
            <div className="w-full">
          
            {type === "followers"
                    ? followersProfile.length > 0?followersProfile.map((profile) =>(
                  
                    <div
                        key={profile?.$id}
                        className="flex items-center gap-4 px-6 py-4 border-b border-gray-900 hover:bg-gray-950 transition"
                    >
                        <img
                            src={profile?.profileImage ? profileAppwrite.getFileView(profile.profileImage) : defaultProfileImage}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-[16px] truncate">
                                {profile?.profileName}
                            </h2>

                            <p className="text-gray-500 text-[15px]">
                                {profile?.bio}
                            </p>
                        </div>

                        {profile?.$id!== userData?.$id &&(<button
                            onClick={() => handleFollow(profile?.$id)}
                            className={`group shrink-0 px-5 py-2 rounded-full font-bold transition-all duration-200 ${
                                IsFollowing(profile?.$id)
                                    ? "border border-gray-500 text-white bg-transparent hover:border-red-500 hover:text-red-500"
                                    : "bg-white text-black hover:bg-gray-200"
                            }`}
                        >
                            {IsFollowing(profile?.$id) ? (
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
                            )}
                        </button>)}
                    </div>
                )) : (<div>
                        <h2>You Don`t have Any Followers yet.</h2>
                    </div>)
                : followingProfile.length>0?followingProfile.filter((profile)=> profile.$id!==userData.$id).map((profile) => (
                    <div
                        key={profile?.$id}
                        className="flex items-center gap-4 px-6 py-4 border-b border-gray-900 hover:bg-gray-950 transition"
                    >
                        <img
                            src={profile?.profileImage ? profileAppwrite.getFileView(profile.profileImage) : defaultProfileImage}
                            alt="Profile"
                            className="w-12 h-12 rounded-full object-cover shrink-0"
                        />

                        <div className="flex-1 min-w-0">
                            <h2 className="font-bold text-[16px] truncate">
                                {profile?.profileName}
                            </h2>

                            <p className="text-gray-500 text-[15px]">
                                {profile?.bio}
                            </p>
                        </div>

                        <button
                            onClick={() => handleFollow(profile?.$id)}
                            className={`group shrink-0 px-5 py-2 rounded-full font-bold transition-all duration-200 ${
                                IsFollowing(profile?.$id)
                                    ? "border border-gray-500 text-white bg-transparent hover:border-red-500 hover:text-red-500"
                                    : "bg-white text-black hover:bg-gray-200"
                            }`}
                        >
                            {IsFollowing(profile?.$id) ? (
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
                            )}
                        </button>
                    </div>
                )) : (<div>
                            <h2>You Are Not Following AnyOne yet.</h2>
                </div>)
            }
            </div>
        </div>
    );
}

export default Follow;