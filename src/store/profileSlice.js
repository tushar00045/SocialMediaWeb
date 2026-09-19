import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  profiles: [],
  currentProfile: null,
  loading:false
}

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setprofiles: (state, action) => {
      state.profiles = action.payload
    },

    setCurrentProfile: (state, action) => {
      state.currentProfile = action.payload
    },

    addProfile: (state, action) => {
      const newProfile = action.payload;

      const alreadyExist = state.profiles.some((profile) => profile.userId === newProfile.userId);

      if (!alreadyExist) {
        state.profiles.push(newProfile);
      }
    },


    updateUserProfile: (state, action) => {
      const updateProfile = action.payload;

      const index = state.profiles.findIndex(
        (profile) => (profile.$id === updateProfile.$id)
      );

      if (index !== -1) {
        state.profiles[index] = updateProfile;
      }

      if (state.currentProfile?.$id === updateProfile.$id) {
        state.currentProfile = updateProfile;
      }
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    clearCurrentProfile: (state, action) => {
      state.currentProfile = null;
    }
  }
});

export const { setprofiles, setCurrentProfile, updateUserProfile, setLoading, clearCurrentProfile,addProfile } = profileSlice.actions;
export default profileSlice.reducer;