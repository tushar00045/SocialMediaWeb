import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import {profileAppwrite} from '../appwrite/profileConfig';
import { CloseIcon, CameraIcon } from './Icons';

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

    const field = "w-full bg-ink-800 border border-white/[0.07] rounded-xl px-4 py-3.5 text-white text-base outline-none placeholder-zinc-600 hover:border-white/15 focus:border-volt/70 focus:ring-4 focus:ring-volt/10 transition";
    const labelCls = "block text-xs font-semibold uppercase tracking-[0.12em] text-zinc-400 mb-2 pl-1";

    return (
        <form
            onSubmit={handleSubmit(save)}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-start overflow-y-auto px-3"
        >
            <div className="animate-rise relative w-full max-w-2xl bg-ink-900 text-white rounded-3xl mt-8 mb-8 border border-white/8 shadow-[0_40px_120px_-30px_rgba(139,124,255,0.45)] overflow-hidden">
                <div className="sticky top-0 z-20 glass border-x-0 border-t-0">
                    <div className="flex items-center justify-between px-5 py-3.5">
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="grid h-10 w-10 place-items-center rounded-xl text-zinc-400 hover:text-white hover:bg-white/6 transition"
                            >
                                <CloseIcon size={20} />
                            </button>

                            <h2 className="font-display text-xl font-bold">Edit profile</h2>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-volt text-black rounded-xl font-semibold hover:brightness-110 active:scale-95 transition disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <div className="relative h-52 sm:h-60 overflow-hidden bg-linear-to-br from-iris/40 via-ink-700 to-volt/20">
                        {coverImage && (
                            <img src={URL.createObjectURL(coverImage)} alt="Cover" className="w-full h-full object-cover" />
                        )}
                        <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/40 transition group">
                            <div className="flex items-center gap-2 rounded-xl bg-black/60 px-4 py-2.5 text-sm font-medium backdrop-blur-md group-hover:scale-105 transition">
                                <CameraIcon size={18} /> {coverImage ? 'Change cover' : 'Add cover'}
                            </div>

                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/jpg,image/gif"
                                className="hidden"
                                onChange={(e) => setCoverImage(e.target.files?.[0])}
                            />
                        </label>
                    </div>

                    <div className="absolute left-6 -bottom-14">
                        <div className="ring-gradient rounded-[30px] p-0.75">
                            <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-[27px] border-4 border-ink-900 overflow-hidden bg-ink-700">
                                {profileImage && (
                                    <img src={URL.createObjectURL(profileImage)} alt="Profile" className="w-full h-full object-cover" />
                                )}
                                <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30 hover:bg-black/50 transition">
                                    <div className="grid h-11 w-11 place-items-center rounded-xl bg-black/60 backdrop-blur-md">
                                        <CameraIcon size={20} />
                                    </div>

                                    <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/jpg,image/gif"
                                        className="hidden"
                                        onChange={(e) => setProfileImage(e.target.files?.[0])}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 pt-20 pb-8 space-y-5">
                    <div>
                        <label className={labelCls}>Name</label>
                        <input
                            type="text"
                            {...register('name', { required: true })}
                            className={field}
                        />
                    </div>

                    <div>
                        <label className={labelCls}>Bio</label>
                        <textarea
                            rows="4"
                            {...register('bio')}
                            className={`${field} resize-none`}
                            placeholder="Tell people about yourself"
                        />
                    </div>

                    <div>
                        <label className={labelCls}>Location</label>
                        <input
                            type="text"
                            {...register('address')}
                            className={field}
                            placeholder="Your location"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}

export default EditProfile;
