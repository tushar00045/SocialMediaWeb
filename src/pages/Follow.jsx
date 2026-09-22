import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import profileAppwrite from '../appwrite/profileConfig';
import AppwriteService from "../appwrite/config";
import { useSelector } from 'react-redux';


function Follow() {
  const {userId,type} = useParams();
  console.log(userId);

  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const followingId = userId;
  
  const profiles = useSelector((state) => state.profile.profiles);

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
      setFollowers(result.documents);
    }

    const handlegetFollowing = async() =>{
        const result = await followAppwrite.getFollowing(followingId);
        
        if (!result) {
            return;
        }
        console.log(result);
      console.log(result.documents);
      setFollowing(result.documents);
   }
    useEffect(() => {
        if (!userId) return;

        if (type === "followers") {
            handlegetFollower();
        } else if (type === "following") {
            handlegetFollowing();
        }
    }, [userId, type]);

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
              onClick={()=>navigate(`/profile/${userId}/following}`)}
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
          
          {/* {
            type === "followers" ? ${`
                              <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-900 hover:bg-gray-950 transition">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-[16px] truncate">
                            ${}
                        </h2>
                        <p className="text-gray-500 text-[15px]">
                            ${}
                        </p>
                    </div>
                    <button className="shrink-0 px-5 py-2 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition">
                        Follow
                    </button>
                </div>
            `}
          :${}
            
          }, */}

            </div>
        </div>
    );
}

export default Follow;