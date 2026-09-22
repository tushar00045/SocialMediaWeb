import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import profileAppwrite from '../appwrite/profileConfig';
import AppwriteService from "../appwrite/config";
import { useSelector } from 'react-redux';
function Follow() {
  const {userId} = useParams();
  console.log(userId);
  
  const profiles = useSelector((state) => state.profile.profiles);

  const currentProfile = profiles.find((profile) => profile?.$id === userId);

  const profileName = currentProfile?.profileName;
  
  console.log(profileName);

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
                            @mrxuniverseus
                        </p>
                    </div>

                </div>
                {/* ================= TABS ================= */}
                <div className="flex border-b border-gray-800">

                    {/* Followers */}

                    <button
                      onClick={() => 
                        navigate(`/profile/${userId}/followers`)
                      }
                      className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-900 transition border-b-4 border-transparent">
                                Followers
                    </button>
                    {/* Following */}
            <button
              onClick={() =>
                navigate(`/profile/${userId}/following`)
              }
              className="flex-1 py-4 font-bold text-white hover:bg-gray-900 transition border-b-4 border-blue-500">
                        Following
                    </button>
                </div>
            </div>
            {/* ================= USER LIST ================= */}
            <div className="w-full">
                {/* ================= USER 1 ================= */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-900 hover:bg-gray-950 transition">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-[16px] truncate">
                            Patricia Valmorbida Honorato
                        </h2>
                        <p className="text-gray-500 text-[15px]">
                            @PatriciaValmor4
                        </p>
                    </div>
                    <button className="shrink-0 px-5 py-2 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition">
                        Follow
                    </button>

                </div>

                {/* ================= USER 2 ================= */}

                <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-900 hover:bg-gray-950 transition">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-[16px] truncate">
                            Arild Olsen
                        </h2>

                        <p className="text-gray-500 text-[15px]">
                            @ArildOlsen2
                        </p>
                    </div>

                    <button className="shrink-0 px-5 py-2 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition">
                        Follow
                    </button>
                </div>

                {/* ================= USER 3 ================= */}

                <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-900 hover:bg-gray-950 transition">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-[16px] truncate">
                            Robert Begley
                        </h2>

                        <p className="text-gray-500 text-[15px]">
                            @RobertB46672604
                        </p>
                    </div>

                    <button className="shrink-0 px-5 py-2 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition">
                        Follow
                    </button>

                </div>
                {/* ================= USER 4 ================= */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-900 hover:bg-gray-950 transition">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-[16px] truncate">
                            George Tzovaras
                        </h2>

                        <p className="text-gray-500 text-[15px]">
                            @georgetzovaras
                        </p>
                    </div>

                    <button className="shrink-0 px-5 py-2 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition">
                        Follow
                    </button>

                </div>
                {/* ================= USER 5 ================= */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-900 hover:bg-gray-950 transition">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">

                        <h2 className="font-bold text-[16px] truncate">
                            Marcello Modugno
                        </h2>

                        <p className="text-gray-500 text-[15px]">
                            @MarcelloModugno
                        </p>

                        <p className="mt-1 text-sm text-gray-300 line-clamp-2">
                            I AM SCIENCE LOVER, ARTIST, BEAUTY ADDICTED.
                        </p>

                    </div>

                    <button className="shrink-0 px-5 py-2 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition">
                        Follow
                    </button>

                </div>
                {/* ================= USER 6 ================= */}
                <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-900 hover:bg-gray-950 transition">

                    <img
                        src="https://via.placeholder.com/100"
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                    />

                    <div className="flex-1 min-w-0">

                        <h2 className="font-bold text-[16px] truncate">
                            Ben Meyer
                        </h2>

                        <p className="text-gray-500 text-[15px]">
                            @BenMeyer619
                        </p>

                    </div>
                    <button className="shrink-0 px-5 py-2 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition">
                        Follow
                    </button>

                </div>

                {/* ================= USER 7 ================= */}

                <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-900 hover:bg-gray-950 transition">
                    <img
                        src="https://via.placeholder.com/100"
                        alt="Profile"
                        className="w-12 h-12 rounded-full object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">

                        <h2 className="font-bold text-[16px] truncate">
                            Stefania Leone
                        </h2>

                        <p className="text-gray-500 text-[15px]">
                            @StefaniaJyotish
                        </p>

                        <p className="mt-1 text-sm text-gray-300 line-clamp-2">
                            Passionate about Jyotisha. Passionate about Transformation.
                            A Private person. Confidentiality and Integrity Rule.
                        </p>

                    </div>

                    <button className="shrink-0 px-5 py-2 rounded-full font-bold bg-white text-black hover:bg-gray-200 transition">
                        Follow
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Follow;