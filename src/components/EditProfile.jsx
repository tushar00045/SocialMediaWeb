import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import profileAppwrite from '../appwrite/profileConfig';

function EditProfile({ onClose }) {
    const userData = useSelector((state) => state.auth.userData);
    const [profileImage, setProfileImage] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            name: userData?.name || '',
            bio: '',
            address: ''
        }
    });

    useEffect(() => {
        setValue('name', userData?.name || '');
    }, [userData, setValue]);

    const save = async (data) => {
        if (!userData?.$id) return;

        try {
            setLoading(true);

            let profileImageId = null;
            if (profileImage) {
                const uploadedProfile = await profileAppwrite.uploadFile(profileImage);
                profileImageId = uploadedProfile.$id;
            }

            let coverImageId = null;
            if (coverImage) {
                const uploadedCover = await profileAppwrite.uploadFile(coverImage);
                coverImageId = uploadedCover.$id;
            }

            const oldProfile = await profileAppwrite.getProfile(userData.$id);
            const finalProfileImage = profileImageId || oldProfile?.profileImage || '';
            const finalCoverImage = coverImageId || oldProfile?.coverImage || '';

            await profileAppwrite.updateProfile(userData.$id, {
                profileImage: finalProfileImage,
                coverImage: finalCoverImage,
                bio: data.bio || '',
                address: data.address || ''
            });

            onClose();
        } catch (error) {
            console.error('Profile update failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit(save)}
            className="fixed inset-0 z-50 bg-black/60 flex justify-center items-start overflow-y-auto"
        >
            <div className="relative w-full max-w-2xl bg-black text-white rounded-2xl mt-8 mb-8 shadow-2xl">
                <div className="sticky top-0 z-20 bg-black border-b border-gray-800">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-3xl hover:bg-gray-900 rounded-full w-10 h-10"
                            >
                                ×
                            </button>

                            <h2 className="text-2xl font-bold">Edit profile</h2>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200 disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div className="h-64 bg-gray-900 overflow-hidden">
                        {coverImage ? (
                            <img src={URL.createObjectURL(coverImage)} alt="Cover" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <label className="cursor-pointer">
                                    <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center text-2xl">
                                        📷
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/gif"
                                        className="hidden"
                                        onChange={(e) => setCoverImage(e.target.files?.[0])}
                                    />
                                </label>
                            </div>
                        )}
                    </div>

                    <div className="absolute left-6 -bottom-16">
                        <div className="w-36 h-36 rounded-full border-4 border-black overflow-hidden bg-blue-900">
                            {profileImage ? (
                                <img src={URL.createObjectURL(profileImage)} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <label className="cursor-pointer">
                                        <div className="w-14 h-14 rounded-full bg-black/60 flex items-center justify-center text-2xl">
                                            📷
                                        </div>

                                        <input
                                            type="file"
                                            accept="image/png,image/jpeg,image/jpg,image/gif"
                                            className="hidden"
                                            onChange={(e) => setProfileImage(e.target.files?.[0])}
                                        />
                                    </label>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-6 pt-24 pb-8 space-y-6">
                    <div>
                        <label className="block text-gray-500 text-sm mb-1">Name</label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-4 text-white text-lg outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-500 text-sm mb-1">Bio</label>
                        <textarea
                            rows="4"
                            {...register('bio')}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-4 text-white text-lg resize-none outline-none focus:border-blue-500"
                            placeholder="Tell people about yourself"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-500 text-sm mb-1">Location</label>
                        <input
                            type="text"
                            {...register('address')}
                            className="w-full bg-black border border-gray-700 rounded-lg px-4 py-4 text-white text-lg outline-none focus:border-blue-500"
                            placeholder="Your location"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}

export default EditProfile;