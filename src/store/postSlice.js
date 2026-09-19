import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  currentPost: null,
  loading: false
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload
    },

    setCurrentPost: (state, action) => {
      state.currentPost = action.payload
    },

    addPost: (state, action) => {
      state.posts.unshift(action.payload)
    },

    removePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.$id !== action.payload)

      if (state.currentPost.$id === action.payload) {
        state.currentPost = null;
      }
    },

    updatePostInStore: (state, action) => {
      const updatePost = action.payload;

      const index = state.posts.findIndex(
        (post) => (post.$id === updatePost.$id)
      );

      if (index !== -1) {
        state.posts[index] = updatePost;
      }

      if (state.currentPost?.$id === updatedPost.$id) {
        state.currentPost = updatedPost;
      }
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    clearCurrentPost: (state, action) => {
      state.currentPost = null;
    }
  }
});

export const { setPosts, setCurrentPost, setLoading, addPost, clearCurrentPost, updatePostInStore, removePost } = postSlice.actions;
export default postSlice.reducer;


